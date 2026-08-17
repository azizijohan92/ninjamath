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
from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {

    collection,
    doc,
    addDoc,
    setDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    updateDoc,
    increment,
    serverTimestamp

}
from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


import {
    generateQuiz
}
from "./questions.js";


// ========================
// GLOBAL STATE
// ========================

let currentUser = null;

let currentChild = null;

let currentTopic =
    "numbers";

let questions = [];

let questionIndex = 0;

let correctAnswers = 0;

let score = 0;

let streak = 0;

let bestStreak = 0;


// ========================
// HELPERS
// ========================

const $ =
    id =>
        document.getElementById(id);


function showPage(id) {

    document
        .querySelectorAll(".page")
        .forEach(page =>
            page.classList.remove(
                "active"
            )
        );

    $(id)
        .classList
        .add(
            "active"
        );

}


function playSound(id) {

    const sound = $(id);

    if (!sound)
        return;

    sound.currentTime = 0;

    sound
        .play()
        .catch(() => {});

}


// ========================
// AUTH
// ========================

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

        try {

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
                        credential
                        .user
                        .email,

                    createdAt:
                        serverTimestamp()

                }
            );

        }
        catch(error) {

            $("authMessage")
                .textContent =
                error.message;

        }

    }
);


$("loginBtn")
.addEventListener(
    "click",
    async () => {

        try {

            await signInWithEmailAndPassword(

                auth,

                $("email")
                    .value
                    .trim(),

                $("password")
                    .value

            );

        }
        catch(error) {

            $("authMessage")
                .textContent =
                "Login failed. Please check your details.";

        }

    }
);


$("logoutBtn")
.addEventListener(
    "click",
    () =>
        signOut(auth)
);


// ========================
// AUTH STATE
// ========================

onAuthStateChanged(
    auth,
    async user => {

        if (user) {

            currentUser =
                user;

            await loadChildren();

            showPage(
                "childPage"
            );

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


// ========================
// CHILD PROFILE
// ========================

$("addChildBtn")
.addEventListener(
    "click",
    async () => {

        const name =
            $("childName")
                .value
                .trim();

        if (!name)
            return;

        await addDoc(

            collection(
                db,
                "users",
                currentUser.uid,
                "children"
            ),

            {

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
            .value = "";

        await loadChildren();

    }
);


async function loadChildren() {

    const container =
        $("childrenList");

    container.innerHTML =
        "Loading...";

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

    snapshot.forEach(
        childDoc => {

            const child =
                childDoc.data();

            const card =
                document.createElement(
                    "button"
                );

            card.className =
                "child-card";

            card.innerHTML = `

                <div class="child-avatar">
                    ${child.avatar || "🥷"}
                </div>

                <h3>
                    ${child.name}
                </h3>

                <p>
                    ⚡ ${child.totalXP || 0} XP
                </p>

            `;

            card.onclick =
                () => {

                    currentChild = {

                        id:
                            childDoc.id,

                        ...child

                    };

                    openStudentHome();

                };

            container
                .appendChild(
                    card
                );

        }
    );

}


// ========================
// STUDENT HOME
// ========================

function openStudentHome() {

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


// ========================
// TOPIC
// ========================

document
.querySelectorAll(
    ".topic-card"
)
.forEach(
    button => {

        button
        .addEventListener(
            "click",
            () => {

                currentTopic =
                    button.dataset.topic;

                startQuiz();

            }
        );

    }
);


$("startTrainingBtn")
.addEventListener(
    "click",
    () => {

        const topics = [

            "numbers",
            "operations",
            "fractions",
            "money",
            "time",
            "measurement",
            "space",
            "data"

        ];

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


// ========================
// QUIZ
// ========================

function startQuiz() {

    questions =
        generateQuiz(
            currentTopic,
            10
        );

    questionIndex = 0;

    correctAnswers = 0;

    score = 0;

    streak = 0;

    bestStreak = 0;

    showPage(
        "quizPage"
    );

    showQuestion();

}


function showQuestion() {

    const q =
        questions[
            questionIndex
        ];

    $("questionNumber")
        .textContent =
        `QUESTION ${
            questionIndex + 1
        } / ${
            questions.length
        }`;

    $("questionText")
        .textContent =
        q.question;

    $("quizScore")
        .textContent =
        score;

    $("progressBar")
        .style.width =
        `${
            (
                questionIndex /
                questions.length
            ) * 100
        }%`;

    const answers =
        $("answersContainer");

    answers.innerHTML =
        "";

    q.answers
    .forEach(
        answer => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "answer-btn";

            button.textContent =
                answer;

            button.onclick =
                () =>
                    checkAnswer(
                        answer,
                        button
                    );

            answers
                .appendChild(
                    button
                );

        }
    );

}


// ========================
// CHECK ANSWER
// ========================

function checkAnswer(
    selected,
    button
) {

    const question =
        questions[
            questionIndex
        ];

    document
    .querySelectorAll(
        ".answer-btn"
    )
    .forEach(
        b =>
            b.disabled = true
    );


    if (
        selected ===
        question.correct
    ) {

        button
            .classList
            .add(
                "correct"
            );

        correctAnswers++;

        streak++;

        score += 10;

        if (
            streak === 3
        ) {

            score += 5;

        }

        if (
            streak === 5
        ) {

            score += 10;

        }

        bestStreak =
            Math.max(
                bestStreak,
                streak
            );

        playSound(
            "correctSound"
        );

    }

    else {

        button
            .classList
            .add(
                "wrong"
            );

        streak = 0;

        document
        .querySelectorAll(
            ".answer-btn"
        )
        .forEach(
            btn => {

                if (
                    btn.textContent ===
                    question.correct
                ) {

                    btn
                        .classList
                        .add(
                            "correct"
                        );

                }

            }
        );

        playSound(
            "wrongSound"
        );

    }


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
        900
    );

}


// ========================
// FINISH QUIZ
// ========================

async function finishQuiz() {

    const accuracy =
        Math.round(

            (
                correctAnswers /
                questions.length
            ) * 100

        );

    let xp =
        correctAnswers * 10;

    if (
        correctAnswers ===
        questions.length
    ) {

        xp += 20;

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


    let stars =
        "⭐";

    if (
        accuracy >= 70
    ) {

        stars =
            "⭐⭐";

    }

    if (
        accuracy >= 90
    ) {

        stars =
            "⭐⭐⭐";

    }

    $("stars")
        .textContent =
        stars;


    await saveAttempt(
        xp,
        accuracy
    );


    currentChild.totalXP =
        (
            currentChild.totalXP ||
            0
        ) + xp;


    $("xpDisplay")
        .textContent =
        currentChild.totalXP;


    playSound(
        "levelSound"
    );


    showPage(
        "resultPage"
    );

}


// ========================
// SAVE RESULT
// ========================

async function saveAttempt(
    xp,
    accuracy
) {

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

            correct:
                correctAnswers,

            total:
                questions.length,

            accuracy,

            score,

            xp,

            createdAt:
                serverTimestamp()

        }

    );


    const childRef =
        doc(

            db,

            "users",
            currentUser.uid,
            "children",
            currentChild.id

        );


    await updateDoc(
        childRef,
        {

            totalXP:
                increment(xp)

        }
    );


    await setDoc(

        doc(
            db,
            "leaderboard",
            currentChild.id
        ),

        {

            nickname:
                currentChild.name,

            avatar:
                currentChild.avatar ||
                "🥷",

            totalXP:
                increment(xp),

            updatedAt:
                serverTimestamp()

        },

        {
            merge: true
        }

    );

}


// ========================
// RESULT BUTTONS
// ========================

$("playAgainBtn")
.addEventListener(
    "click",
    startQuiz
);


$("resultHomeBtn")
.addEventListener(
    "click",
    openStudentHome
);


// ========================
// LEADERBOARD
// ========================

$("navLeaderboard")
.addEventListener(
    "click",
    loadLeaderboard
);


$("leaderboardBack")
.addEventListener(
    "click",
    openStudentHome
);


async function loadLeaderboard() {

    showPage(
        "leaderboardPage"
    );

    const container =
        $("leaderboardList");

    container.innerHTML =
        "Loading Ninja Ranking...";


    const q =
        query(

            collection(
                db,
                "leaderboard"
            ),

            orderBy(
                "totalXP",
                "desc"
            ),

            limit(20)

        );


    const snapshot =
        await getDocs(q);

    container.innerHTML =
        "";

    let rank = 1;


    snapshot.forEach(
        rankingDoc => {

            const player =
                rankingDoc.data();

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "ranking-row";

            row.innerHTML = `

                <strong>
                    #${rank}
                </strong>

                <span>
                    ${player.avatar || "🥷"}
                    ${player.nickname}
                </span>

                <strong>
                    ⚡ ${player.totalXP || 0}
                </strong>

            `;

            container
                .appendChild(
                    row
                );

            rank++;

        }
    );

}


// ========================
// PARENT DASHBOARD
// ========================

$("navParent")
.addEventListener(
    "click",
    loadParentDashboard
);


$("parentBack")
.addEventListener(
    "click",
    openStudentHome
);


async function loadParentDashboard() {

    showPage(
        "parentPage"
    );


    const q =
        query(

            collection(
                db,
                "attempts"
            ),

            where(
                "uid",
                "==",
                currentUser.uid
            ),

            where(
                "childId",
                "==",
                currentChild.id
            )

        );


    const snapshot =
        await getDocs(q);


    let totalAccuracy = 0;

    let totalXP = 0;

    let attempts = [];


    snapshot.forEach(
        attemptDoc => {

            const data =
                attemptDoc.data();

            attempts.push(
                data
            );

            totalAccuracy +=
                data.accuracy || 0;

            totalXP +=
                data.xp || 0;

        }
    );


    $("parentXP")
        .textContent =
        totalXP;


    $("parentQuizzes")
        .textContent =
        attempts.length;


    $("parentAverage")
        .textContent =

        attempts.length

        ?

        `${
            Math.round(
                totalAccuracy /
                attempts.length
            )
        }%`

        :

        "0%";


    const list =
        $("recentAttempts");

    list.innerHTML =
        "";


    attempts
    .slice(-10)
    .reverse()
    .forEach(
        attempt => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "attempt-row";

            row.innerHTML = `

                <strong>
                    ${attempt.topic}
                </strong>

                <span>
                    ${attempt.accuracy}%
                </span>

                <span>
                    +${attempt.xp} XP
                </span>

            `;

            list
                .appendChild(
                    row
                );

        }
    );

}


// ========================
// EXIT QUIZ
// ========================

$("exitQuiz")
.addEventListener(
    "click",
    openStudentHome
);

