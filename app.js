/* =========================================
   FIREBASE
========================================= */

import {
    auth,
    db
}
from "./firebase-config.js";


import {

    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


import {

    collection,
    doc,
    addDoc,
    setDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    increment,
    serverTimestamp

}
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


import {
    generateQuiz
}
from "./questions.js";



/* =========================================
   APP STATE
========================================= */

let currentUser =
    null;


let currentChild =
    null;


let currentTopic =
    "numbers";


let questions =
    [];


let questionIndex =
    0;


let correctAnswers =
    0;


let score =
    0;


let streak =
    0;


let bestStreak =
    0;


let answeringLocked =
    false;


let soundEnabled =
    true;


let audioContext =
    null;



/* =========================================
   TOPIC INFORMATION
========================================= */

const topicNames = {

    numbers:
        "Number Ninja",

    operations:
        "Operation Ninja",

    fractions:
        "Fraction Ninja",

    money:
        "Money Ninja",

    time:
        "Time Ninja",

    measurement:
        "Measurement Ninja",

    space:
        "Shape Ninja",

    data:
        "Data Ninja"

};



const topicIcons = {

    numbers:
        "🔢",

    operations:
        "➕",

    fractions:
        "🍕",

    money:
        "💰",

    time:
        "⏰",

    measurement:
        "📏",

    space:
        "🔺",

    data:
        "📊"

};



/* =========================================
   DOM HELPER
========================================= */

function $(
    id
) {

    return document.getElementById(
        id
    );

}



/* =========================================
   PAGE CONTROL
========================================= */

function showPage(
    pageId
) {

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            page => {

                page.classList.remove(
                    "active"
                );

            }
        );


    const page =
        $(
            pageId
        );


    if (
        page
    ) {

        page.classList.add(
            "active"
        );

    }


    window.scrollTo(
        {
            top:
                0,

            behavior:
                "smooth"
        }
    );

}



/* =========================================
   SIMPLE SOUND ENGINE
========================================= */

function getAudioContext() {

    if (
        !audioContext
    ) {

        const AudioContext =
            window.AudioContext
            ||
            window.webkitAudioContext;


        if (
            AudioContext
        ) {

            audioContext =
                new AudioContext();

        }

    }


    return audioContext;

}



function tone(
    frequency,
    duration,
    type = "sine",
    volume = 0.08,
    delay = 0
) {

    if (
        !soundEnabled
    ) {

        return;

    }


    const ctx =
        getAudioContext();


    if (
        !ctx
    ) {

        return;

    }


    if (
        ctx.state ===
        "suspended"
    ) {

        ctx.resume();

    }


    const oscillator =
        ctx.createOscillator();


    const gain =
        ctx.createGain();


    oscillator.type =
        type;


    oscillator.frequency.value =
        frequency;


    gain.gain.value =
        volume;


    oscillator.connect(
        gain
    );


    gain.connect(
        ctx.destination
    );


    const start =
        ctx.currentTime +
        delay;


    oscillator.start(
        start
    );


    gain.gain.setValueAtTime(
        volume,
        start
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        start + duration
    );


    oscillator.stop(
        start + duration
    );

}



function playCorrectSound() {

    tone(
        523,
        0.12,
        "sine",
        0.08,
        0
    );


    tone(
        659,
        0.15,
        "sine",
        0.08,
        0.08
    );


    tone(
        784,
        0.18,
        "sine",
        0.08,
        0.16
    );

}



function playWrongSound() {

    tone(
        220,
        0.18,
        "square",
        0.035,
        0
    );


    tone(
        180,
        0.22,
        "square",
        0.03,
        0.12
    );

}



function playCompleteSound() {

    tone(
        523,
        0.15,
        "triangle",
        0.08,
        0
    );


    tone(
        659,
        0.15,
        "triangle",
        0.08,
        0.12
    );


    tone(
        784,
        0.15,
        "triangle",
        0.08,
        0.24
    );


    tone(
        1046,
        0.35,
        "triangle",
        0.08,
        0.36
    );

}



/* =========================================
   SOUND BUTTON
========================================= */

$("soundBtn")
    .addEventListener(
        "click",
        () => {

            soundEnabled =
                !soundEnabled;


            $("soundBtn")
                .textContent =
                soundEnabled
                ? "🔊"
                : "🔇";


            if (
                soundEnabled
            ) {

                playCorrectSound();

            }

        }
    );



/* =========================================
   REGISTER
========================================= */

$("registerBtn")
    .addEventListener(
        "click",
        async () => {

            const email =
                $("email")
                    .value
                    .trim();


            const password =
                $("password")
                    .value;


            $("authMessage")
                .textContent =
                "";


            if (
                !email
                ||
                !password
            ) {

                $("authMessage")
                    .textContent =
                    "Please enter your email and password.";

                return;

            }


            if (
                password.length <
                6
            ) {

                $("authMessage")
                    .textContent =
                    "Password must contain at least 6 characters.";

                return;

            }


            try {

                $("registerBtn")
                    .disabled =
                    true;


                $("registerBtn")
                    .textContent =
                    "CREATING ACCOUNT...";


                const credential =
                    await createUserWithEmailAndPassword(

                        auth,

                        email,

                        password

                    );


                await setDoc(

                    doc(
                        db,
                        "users",
                        credential.user.uid
                    ),

                    {

                        email:
                            credential.user.email,

                        createdAt:
                            serverTimestamp()

                    }

                );


            }
            catch (
                error
            ) {

                console.error(
                    error
                );


                $("authMessage")
                    .textContent =
                    friendlyAuthError(
                        error.code
                    );

            }
            finally {

                $("registerBtn")
                    .disabled =
                    false;


                $("registerBtn")
                    .textContent =
                    "CREATE NEW ACCOUNT";

            }

        }
    );



/* =========================================
   LOGIN
========================================= */

$("loginBtn")
    .addEventListener(
        "click",
        async () => {

            const email =
                $("email")
                    .value
                    .trim();


            const password =
                $("password")
                    .value;


            $("authMessage")
                .textContent =
                "";


            if (
                !email
                ||
                !password
            ) {

                $("authMessage")
                    .textContent =
                    "Please enter your email and password.";

                return;

            }


            try {

                $("loginBtn")
                    .disabled =
                    true;


                $("loginBtn")
                    .textContent =
                    "LOGGING IN...";


                await signInWithEmailAndPassword(

                    auth,

                    email,

                    password

                );


            }
            catch (
                error
            ) {

                console.error(
                    error
                );


                $("authMessage")
                    .textContent =
                    friendlyAuthError(
                        error.code
                    );

            }
            finally {

                $("loginBtn")
                    .disabled =
                    false;


                $("loginBtn")
                    .textContent =
                    "LOGIN";

            }

        }
    );



/* =========================================
   AUTH ERROR
========================================= */

function friendlyAuthError(
    code
) {

    if (
        code ===
        "auth/email-already-in-use"
    ) {

        return "This email already has a NinjaMath account.";

    }


    if (
        code ===
        "auth/invalid-email"
    ) {

        return "Please enter a valid email address.";

    }


    if (
        code ===
        "auth/weak-password"
    ) {

        return "Please use a stronger password.";

    }


    if (
        code ===
        "auth/invalid-credential"
    ) {

        return "Incorrect email or password.";

    }


    return "Something went wrong. Please try again.";

}



/* =========================================
   LOGOUT
========================================= */

$("logoutBtn")
    .addEventListener(
        "click",
        async () => {

            await signOut(
                auth
            );

        }
    );



/* =========================================
   AUTH STATE
========================================= */

onAuthStateChanged(

    auth,

    async user => {

        if (
            user
        ) {

            currentUser =
                user;


            try {

                await loadChildren();


                showPage(
                    "childPage"
                );

            }
            catch (
                error
            ) {

                console.error(
                    "Unable to load children:",
                    error
                );

            }

        }
        else {

            currentUser =
                null;


            currentChild =
                null;


            showPage(
                "authPage"
            );

        }

    }

);



/* =========================================
   CREATE CHILD
========================================= */

$("addChildBtn")
    .addEventListener(
        "click",
        async () => {

            const name =
                $("childName")
                    .value
                    .trim();


            $("childMessage")
                .textContent =
                "";


            if (
                !name
            ) {

                $("childMessage")
                    .textContent =
                    "Please enter a ninja nickname.";

                return;

            }


            if (
                !currentUser
            ) {

                return;

            }


            try {

                $("addChildBtn")
                    .disabled =
                    true;


                await addDoc(

                    collection(
                        db,
                        "users",
                        currentUser.uid,
                        "children"
                    ),

                    {

                        name:
                            name,

                        avatar:
                            "🥷",

                        age:
                            7,

                        year:
                            1,

                        totalXP:
                            0,

                        level:
                            1,

                        createdAt:
                            serverTimestamp()

                    }

                );


                $("childName")
                    .value =
                    "";


                await loadChildren();


            }
            catch (
                error
            ) {

                console.error(
                    error
                );


                $("childMessage")
                    .textContent =
                    "Unable to create profile. Please try again.";

            }
            finally {

                $("addChildBtn")
                    .disabled =
                    false;

            }

        }
    );



/* =========================================
   LOAD CHILDREN
========================================= */

async function loadChildren() {

    if (
        !currentUser
    ) {

        return;

    }


    const container =
        $("childrenList");


    container.innerHTML =
        `

        <div class="empty-state">
            Loading Ninja profiles...
        </div>

        `;


    const snapshot =
        await getDocs(

            collection(
                db,
                "users",
                currentUser.uid,
                "children"
            )

        );


    container.innerHTML =
        "";


    if (
        snapshot.empty
    ) {

        container.innerHTML =
            `

            <div class="empty-state">

                <div style="font-size:45px;">
                    🥷
                </div>

                <h3>
                    No Ninja yet!
                </h3>

                <p>
                    Create your child's first profile below.
                </p>

            </div>

            `;

        return;

    }


    snapshot.forEach(
        childDocument => {

            const childData =
                childDocument.data();


            const card =
                document.createElement(
                    "button"
                );


            card.className =
                "child-card";


            card.innerHTML =
                `

                <div class="child-avatar">
                    ${childData.avatar || "🥷"}
                </div>

                <h3>
                    ${escapeHTML(
                        childData.name
                    )}
                </h3>

                <p>
                    Year 1 Ninja
                </p>

                <div class="child-xp">
                    ⚡ ${childData.totalXP || 0} XP
                </div>

                `;


            card.addEventListener(
                "click",
                () => {

                    currentChild = {

                        id:
                            childDocument.id,

                        ...childData

                    };


                    openStudentHome();

                }
            );


            container.appendChild(
                card
            );

        }
    );

}



/* =========================================
   ESCAPE USER TEXT
========================================= */

function escapeHTML(
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        value || "";


    return element.innerHTML;

}



/* =========================================
   HOME
========================================= */

function openStudentHome() {

    if (
        !currentChild
    ) {

        showPage(
            "childPage"
        );

        return;

    }


    $("welcomeName")
        .textContent =
        currentChild.name;


    $("xpDisplay")
        .textContent =
        currentChild.totalXP || 0;


    showPage(
        "homePage"
    );

}



/* =========================================
   SWITCH CHILD
========================================= */

$("switchChildBtn")
    .addEventListener(
        "click",
        async () => {

            currentChild =
                null;


            await loadChildren();


            showPage(
                "childPage"
            );

        }
    );



/* =========================================
   TOPIC BUTTONS
========================================= */

document
    .querySelectorAll(
        ".topic-card"
    )
    .forEach(
        button => {

            button.addEventListener(

                "click",

                () => {

                    currentTopic =
                        button.dataset.topic;


                    startQuiz();

                }

            );

        }
    );



/* =========================================
   RANDOM TRAINING
========================================= */

$("startTrainingBtn")
    .addEventListener(
        "click",
        () => {

            const topics =
                Object.keys(
                    topicNames
                );


            currentTopic =
                topics[
                    Math.floor(
                        Math.random() *
                        topics.length
                    )
                ];


            startQuiz();

        }
    );



/* =========================================
   START QUIZ
========================================= */

function startQuiz() {

    questions =
        generateQuiz(
            currentTopic,
            10
        );


    questionIndex =
        0;


    correctAnswers =
        0;


    score =
        0;


    streak =
        0;


    bestStreak =
        0;


    answeringLocked =
        false;


    $("quizTopic")
        .textContent =
        topicNames[
            currentTopic
        ];


    $("quizScore")
        .textContent =
        "0";


    $("streakDisplay")
        .textContent =
        "0";


    showPage(
        "quizPage"
    );


    showQuestion();

}



/* =========================================
   SHOW QUESTION
========================================= */

function showQuestion() {

    answeringLocked =
        false;


    const question =
        questions[
            questionIndex
        ];


    $("questionNumber")
        .textContent =
        `Question ${
            questionIndex + 1
        } / ${
            questions.length
        }`;


    $("questionText")
        .textContent =
        question.question;


    $("quizScore")
        .textContent =
        score;


    $("streakDisplay")
        .textContent =
        streak;


    $("answerFeedback")
        .textContent =
        "";


    $("answerFeedback")
        .className =
        "answer-feedback";


    const progress =
        (
            questionIndex /
            questions.length
        )
        *
        100;


    $("progressBar")
        .style
        .width =
        `${progress}%`;


    const answersContainer =
        $("answersContainer");


    answersContainer.innerHTML =
        "";


    question.answers.forEach(

        answer => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "answer-btn";


            button.textContent =
                answer;


            button.addEventListener(

                "click",

                () =>
                    checkAnswer(
                        answer,
                        button
                    )

            );


            answersContainer.appendChild(
                button
            );

        }

    );

}



/* =========================================
   CHECK ANSWER
========================================= */

function checkAnswer(
    selectedAnswer,
    selectedButton
) {

    if (
        answeringLocked
    ) {

        return;

    }


    answeringLocked =
        true;


    const question =
        questions[
            questionIndex
        ];


    const buttons =
        document.querySelectorAll(
            ".answer-btn"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;

        }
    );


    const correct =
        selectedAnswer ===
        question.correct;


    if (
        correct
    ) {

        correctAnswers++;


        streak++;


        bestStreak =
            Math.max(
                bestStreak,
                streak
            );


        let points =
            10;


        if (
            streak === 3
        ) {

            points +=
                5;

        }


        if (
            streak === 5
        ) {

            points +=
                10;

        }


        if (
            streak === 10
        ) {

            points +=
                20;

        }


        score +=
            points;


        selectedButton
            .classList
            .add(
                "correct"
            );


        $("answerFeedback")
            .textContent =
            streak >= 3
            ? `🔥 Awesome! ${streak} answer streak!`
            : "✅ Correct! Great job!";


        $("answerFeedback")
            .classList
            .add(
                "feedback-correct"
            );


        playCorrectSound();

    }
    else {

        streak =
            0;


        selectedButton
            .classList
            .add(
                "wrong"
            );


        buttons.forEach(
            button => {

                if (
                    button.textContent ===
                    question.correct
                ) {

                    button.classList.add(
                        "correct"
                    );

                }

            }
        );


        $("answerFeedback")
            .textContent =
            `💡 Nice try! The answer is ${question.correct}.`;


        $("answerFeedback")
            .classList
            .add(
                "feedback-wrong"
            );


        playWrongSound();

    }


    $("quizScore")
        .textContent =
        score;


    $("streakDisplay")
        .textContent =
        streak;


    setTimeout(
        () => {

            questionIndex++;


            if (
                questionIndex <
                questions.length
            ) {

                showQuestion();

            }
            else {

                finishQuiz();

            }

        },
        1100
    );

}



/* =========================================
   FINISH QUIZ
========================================= */

async function finishQuiz() {

    $("progressBar")
        .style
        .width =
        "100%";


    const accuracy =
        Math.round(
            (
                correctAnswers /
                questions.length
            )
            *
            100
        );


    let xp =
        score;


    if (
        accuracy === 100
    ) {

        xp +=
            25;

    }


    $("finalScore")
        .textContent =
        score;


    $("correctResult")
        .textContent =
        `${correctAnswers}/${questions.length}`;


    $("accuracyResult")
        .textContent =
        `${accuracy}%`;


    $("xpResult")
        .textContent =
        `+${xp}`;


    $("bestStreakResult")
        .textContent =
        bestStreak;



    /* STARS */

    if (
        accuracy >= 90
    ) {

        $("stars")
            .textContent =
            "⭐⭐⭐";

    }
    else if (
        accuracy >= 70
    ) {

        $("stars")
            .textContent =
            "⭐⭐";

    }
    else {

        $("stars")
            .textContent =
            "⭐";

    }



    /* MASTERY MESSAGE */

    $("masteryMessage")
        .textContent =
        getMasteryMessage(
            accuracy
        );


    try {

        await saveAttempt(
            xp,
            accuracy
        );

    }
    catch (
        error
    ) {

        console.error(
            "Unable to save quiz:",
            error
        );

    }


    currentChild.totalXP =
        (
            currentChild.totalXP ||
            0
        )
        +
        xp;


    $("xpDisplay")
        .textContent =
        currentChild.totalXP;


    playCompleteSound();


    showPage(
        "resultPage"
    );

}



/* =========================================
   MASTERY
========================================= */

function getMasteryMessage(
    accuracy
) {

    if (
        accuracy >=
        95
    ) {

        return "🥷 NINJA MASTER — Outstanding mastery!";

    }


    if (
        accuracy >=
        85
    ) {

        return "🏆 MASTERED — Excellent work!";

    }


    if (
        accuracy >=
        70
    ) {

        return "⭐ GOOD — Keep training to reach mastery!";

    }


    if (
        accuracy >=
        50
    ) {

        return "💪 LEARNING — You're getting stronger!";

    }


    return "🥋 NEEDS TRAINING — Keep practising. You can do it!";

}



/* =========================================
   SAVE QUIZ
========================================= */

async function saveAttempt(
    xp,
    accuracy
) {

    if (
        !currentUser
        ||
        !currentChild
    ) {

        return;

    }


    await addDoc(

        collection(
            db,
            "attempts"
        ),

        {

            uid:
                currentUser.uid,

            childId:
                currentChild.id,

            childName:
                currentChild.name,

            topic:
                currentTopic,

            topicName:
                topicNames[
                    currentTopic
                ],

            correct:
                correctAnswers,

            total:
                questions.length,

            accuracy:
                accuracy,

            score:
                score,

            xp:
                xp,

            bestStreak:
                bestStreak,

            createdAt:
                serverTimestamp()

        }

    );



    const childReference =
        doc(

            db,

            "users",
            currentUser.uid,
            "children",
            currentChild.id

        );


    await updateDoc(

        childReference,

        {

            totalXP:
                increment(
                    xp
                )

        }

    );



    const newTotalXP =
        (
            currentChild.totalXP ||
            0
        )
        +
        xp;



    const rankingId =
        `${currentUser.uid}_${currentChild.id}`;



    await setDoc(

        doc(
            db,
            "leaderboard",
            rankingId
        ),

        {

            ownerUid:
                currentUser.uid,

            childId:
                currentChild.id,

            nickname:
                currentChild.name,

            avatar:
                currentChild.avatar ||
                "🥷",

            totalXP:
                newTotalXP,

            updatedAt:
                serverTimestamp()

        },

        {
            merge:
                true
        }

    );

}



/* =========================================
   RESULT BUTTONS
========================================= */

$("playAgainBtn")
    .addEventListener(
        "click",
        () => {

            startQuiz();

        }
    );


$("resultHomeBtn")
    .addEventListener(
        "click",
        () => {

            openStudentHome();

        }
    );


$("resultRankingBtn")
    .addEventListener(
        "click",
        () => {

            loadLeaderboard();

        }
    );



/* =========================================
   EXIT QUIZ
========================================= */

$("exitQuiz")
    .addEventListener(
        "click",
        () => {

            openStudentHome();

        }
    );



/* =========================================
   LEADERBOARD
========================================= */

async function loadLeaderboard() {

    showPage(
        "leaderboardPage"
    );


    const container =
        $("leaderboardList");


    container.innerHTML =
        `

        <div class="empty-state">
            Loading Ninja Ranking...
        </div>

        `;


    try {

        const rankingQuery =
            query(

                collection(
                    db,
                    "leaderboard"
                ),

                orderBy(
                    "totalXP",
                    "desc"
                ),

                limit(
                    50
                )

            );


        const snapshot =
            await getDocs(
                rankingQuery
            );


        container.innerHTML =
            "";


        if (
            snapshot.empty
        ) {

            container.innerHTML =
                `

                <div class="empty-state">

                    <div style="font-size:50px;">
                        🏆
                    </div>

                    <h3>
                        No ranking yet!
                    </h3>

                    <p>
                        Complete your first mission to enter the Ninja Ranking.
                    </p>

                </div>

                `;

            return;

        }


        let rank =
            1;


        snapshot.forEach(
            rankingDocument => {

                const player =
                    rankingDocument.data();


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "ranking-row";


                if (
                    rank === 1
                ) {

                    row.classList.add(
                        "top-one"
                    );

                }


                if (
                    currentUser
                    &&
                    currentChild
                    &&
                    player.ownerUid ===
                    currentUser.uid
                    &&
                    player.childId ===
                    currentChild.id
                ) {

                    row.classList.add(
                        "my-ranking"
                    );

                }


                let rankDisplay =
                    `#${rank}`;


                if (
                    rank === 1
                ) {

                    rankDisplay =
                        "🥇";

                }
                else if (
                    rank === 2
                ) {

                    rankDisplay =
                        "🥈";

                }
                else if (
                    rank === 3
                ) {

                    rankDisplay =
                        "🥉";

                }


                row.innerHTML =
                    `

                    <div class="rank-number">
                        ${rankDisplay}
                    </div>

                    <div class="rank-player">

                        <div class="rank-avatar">
                            ${player.avatar || "🥷"}
                        </div>

                        <span>
                            ${escapeHTML(
                                player.nickname
                            )}
                        </span>

                    </div>

                    <div class="rank-xp">
                        ⚡ ${player.totalXP || 0} XP
                    </div>

                    `;


                container.appendChild(
                    row
                );


                rank++;

            }
        );


    }
    catch (
        error
    ) {

        console.error(
            error
        );


        container.innerHTML =
            `

            <div class="empty-state">
                Unable to load ranking.
            </div>

            `;

    }

}



/* =========================================
   GET ATTEMPTS
========================================= */

async function getCurrentChildAttempts() {

    if (
        !currentUser
        ||
        !currentChild
    ) {

        return [];

    }


    const attemptsQuery =
        query(

            collection(
                db,
                "attempts"
            ),

            where(
                "uid",
                "==",
                currentUser.uid
            )

        );


    const snapshot =
        await getDocs(
            attemptsQuery
        );


    const attempts =
        [];


    snapshot.forEach(
        attemptDocument => {

            const data =
                attemptDocument.data();


            if (
                data.childId ===
                currentChild.id
            ) {

                attempts.push(
                    data
                );

            }

        }
    );


    attempts.sort(
        (
            a,
            b
        ) => {

            const dateA =
                a.createdAt
                ?.toMillis?.()
                ||
                0;


            const dateB =
                b.createdAt
                ?.toMillis?.()
                ||
                0;


            return dateB -
                dateA;

        }
    );


    return attempts;

}



/* =========================================
   PROGRESS PAGE
========================================= */

async function loadProgress() {

    showPage(
        "progressPage"
    );


    const attempts =
        await getCurrentChildAttempts();


    const totalMissions =
        attempts.length;


    const totalAccuracy =
        attempts.reduce(
            (
                sum,
                attempt
            ) =>
                sum +
                (
                    attempt.accuracy ||
                    0
                ),

            0
        );


    const average =
        totalMissions
        ?
        Math.round(
            totalAccuracy /
            totalMissions
        )
        :
        0;


    $("progressXP")
        .textContent =
        currentChild.totalXP ||
        0;


    $("progressMissions")
        .textContent =
        totalMissions;


    $("progressAccuracy")
        .textContent =
        `${average}%`;


    renderTopicProgress(
        attempts
    );

}



/* =========================================
   TOPIC PROGRESS
========================================= */

function renderTopicProgress(
    attempts
) {

    const container =
        $("topicProgressList");


    container.innerHTML =
        "";


    Object.keys(
        topicNames
    )
    .forEach(
        topic => {

            const topicAttempts =
                attempts.filter(
                    attempt =>
                        attempt.topic ===
                        topic
                );


            let accuracy =
                0;


            if (
                topicAttempts.length
            ) {

                accuracy =
                    Math.round(

                        topicAttempts.reduce(
                            (
                                total,
                                attempt
                            ) =>
                                total +
                                (
                                    attempt.accuracy ||
                                    0
                                ),

                            0
                        )
                        /
                        topicAttempts.length

                    );

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "topic-progress-card";


            card.innerHTML =
                `

                <div class="topic-progress-top">

                    <div class="topic-progress-name">
                        ${topicIcons[topic]}
                        ${topicNames[topic]}
                    </div>

                    <div class="topic-progress-score">
                        ${accuracy}%
                    </div>

                </div>


                <div class="mastery-track">

                    <div
                        class="mastery-fill"
                        style="width:${accuracy}%"
                    ></div>

                </div>


                <div class="mastery-label">

                    ${
                        getProgressLabel(
                            accuracy,
                            topicAttempts.length
                        )
                    }

                </div>

                `;


            container.appendChild(
                card
            );

        }
    );

}



/* =========================================
   PROGRESS LABEL
========================================= */

function getProgressLabel(
    accuracy,
    attempts
) {

    if (
        attempts === 0
    ) {

        return "NOT STARTED";

    }


    if (
        accuracy >= 95
    ) {

        return "NINJA MASTER";

    }


    if (
        accuracy >= 85
    ) {

        return "MASTERED";

    }


    if (
        accuracy >= 70
    ) {

        return "GOOD";

    }


    if (
        accuracy >= 50
    ) {

        return "LEARNING";

    }


    return "NEEDS TRAINING";

}



/* =========================================
   PARENT DASHBOARD
========================================= */

async function loadParentDashboard() {

    showPage(
        "parentPage"
    );


    $("parentChildName")
        .textContent =
        currentChild.name;


    const attempts =
        await getCurrentChildAttempts();


    const numberOfAttempts =
        attempts.length;


    const totalAccuracy =
        attempts.reduce(
            (
                sum,
                attempt
            ) =>
                sum +
                (
                    attempt.accuracy ||
                    0
                ),

            0
        );


    const average =
        numberOfAttempts
        ?
        Math.round(
            totalAccuracy /
            numberOfAttempts
        )
        :
        0;


    $("parentXP")
        .textContent =
        currentChild.totalXP ||
        0;


    $("parentQuizzes")
        .textContent =
        numberOfAttempts;


    $("parentAverage")
        .textContent =
        `${average}%`;


    const list =
        $("recentAttempts");


    list.innerHTML =
        "";


    if (
        attempts.length ===
        0
    ) {

        list.innerHTML =
            `

            <div class="empty-state">

                <div style="font-size:45px;">
                    📚
                </div>

                <h3>
                    No training yet
                </h3>

                <p>
                    Quiz results will appear here after your child completes a mission.
                </p>

            </div>

            `;

        return;

    }


    attempts
        .slice(
            0,
            10
        )
        .forEach(
            attempt => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "attempt-row";


                row.innerHTML =
                    `

                    <div class="attempt-topic">

                        ${
                            topicIcons[
                                attempt.topic
                            ]
                            ||
                            "🥷"
                        }

                        ${
                            escapeHTML(
                                attempt.topicName
                                ||
                                topicNames[
                                    attempt.topic
                                ]
                                ||
                                "Math Training"
                            )
                        }

                    </div>


                    <div class="attempt-score">
                        ${attempt.accuracy || 0}%
                    </div>


                    <div class="attempt-xp">
                        +${attempt.xp || 0} XP
                    </div>

                    `;


                list.appendChild(
                    row
                );

            }
        );

}



/* =========================================
   NAVIGATION
========================================= */

$("navHome")
    .addEventListener(
        "click",
        () => {

            openStudentHome();

        }
    );


$("navLeaderboard")
    .addEventListener(
        "click",
        () => {

            loadLeaderboard();

        }
    );


$("navProgress")
    .addEventListener(
        "click",
        () => {

            loadProgress();

        }
    );


$("navParent")
    .addEventListener(
        "click",
        () => {

            loadParentDashboard();

        }
    );


$("leaderboardBack")
    .addEventListener(
        "click",
        () => {

            openStudentHome();

        }
    );


$("progressBack")
    .addEventListener(
        "click",
        () => {

            openStudentHome();

        }
    );


$("parentBack")
    .addEventListener(
        "click",
        () => {

            openStudentHome();

        }
    );



/* =========================================
   ENTER KEY LOGIN
========================================= */

$("password")
    .addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                $("loginBtn")
                    .click();

            }

        }
    );
