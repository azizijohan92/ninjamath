function shuffle(array) {

    return [...array]
        .sort(() =>
            Math.random() - 0.5
        );

}

function mcq(
    question,
    correct,
    wrongAnswers
) {

    return {

        question,

        correct:
            String(correct),

        answers:
            shuffle([
                correct,
                ...wrongAnswers
            ].map(String))

    };

}


// ============================
// NUMBERS
// ============================

function numberQuestion() {

    const type =
        Math.floor(
            Math.random() * 4
        );

    if (type === 0) {

        const n =
            Math.floor(
                Math.random() * 91
            ) + 10;

        return mcq(
            `What number comes after ${n}?`,
            n + 1,
            [
                n - 1,
                n + 2,
                n + 10
            ]
        );

    }

    if (type === 1) {

        const n =
            Math.floor(
                Math.random() * 90
            ) + 2;

        return mcq(
            `What number comes before ${n}?`,
            n - 1,
            [
                n + 1,
                n - 2,
                n + 10
            ]
        );

    }

    if (type === 2) {

        let a =
            Math.floor(
                Math.random() * 100
            ) + 1;

        let b =
            Math.floor(
                Math.random() * 100
            ) + 1;

        return mcq(
            `Which number is greater?`,
            Math.max(a,b),
            [
                Math.min(a,b),
                Math.max(a,b) + 1,
                Math.max(a,b) - 1
            ]
        );

    }

    const tens =
        Math.floor(
            Math.random() * 9
        ) + 1;

    const ones =
        Math.floor(
            Math.random() * 10
        );

    const number =
        tens * 10 + ones;

    return mcq(
        `${number} has how many tens?`,
        tens,
        [
            ones,
            tens + 1,
            Math.max(
                0,
                tens - 1
            )
        ]
    );

}


// ============================
// OPERATIONS
// ============================

function operationQuestion() {

    const addition =
        Math.random() > .5;

    if (addition) {

        let a =
            Math.floor(
                Math.random() * 40
            );

        let b =
            Math.floor(
                Math.random() * 40
            );

        if (
            a + b > 100
        ) {

            b = 100 - a;

        }

        const answer =
            a + b;

        return mcq(
            `${a} + ${b} = ?`,
            answer,
            [
                answer + 1,
                Math.max(
                    0,
                    answer - 1
                ),
                answer + 10
            ]
        );

    }


    let a =
        Math.floor(
            Math.random() * 80
        ) + 20;

    let b =
        Math.floor(
            Math.random() * a
        );

    const answer =
        a - b;

    return mcq(
        `${a} − ${b} = ?`,
        answer,
        [
            answer + 1,
            Math.max(
                0,
                answer - 1
            ),
            answer + 10
        ]
    );

}


// ============================
// FRACTIONS
// ============================

function fractionQuestion() {

    const questions = [

        mcq(
            "One of two equal parts is called?",
            "One half",
            [
                "One quarter",
                "One whole",
                "Two halves"
            ]
        ),

        mcq(
            "How many halves make one whole?",
            "2",
            [
                "1",
                "3",
                "4"
            ]
        ),

        mcq(
            "How many quarters make one whole?",
            "4",
            [
                "2",
                "3",
                "5"
            ]
        ),

        mcq(
            "Which is bigger?",
            "One half",
            [
                "One quarter",
                "They are equal",
                "Zero"
            ]
        )

    ];

    return questions[
        Math.floor(
            Math.random() *
            questions.length
        )
    ];

}


// ============================
// MONEY
// ============================

function moneyQuestion() {

    let price =
        Math.floor(
            Math.random() * 9
        ) + 1;

    let quantity =
        Math.floor(
            Math.random() * 4
        ) + 1;

    const total =
        price * quantity;

    return mcq(
        `${quantity} pencils cost RM${price} each. How much altogether?`,
        `RM${total}`,
        [
            `RM${total + 1}`,
            `RM${Math.max(
                1,
                total - 1
            )}`,
            `RM${price}`
        ]
    );

}


// ============================
// TIME
// ============================

function timeQuestion() {

    const hour =
        Math.floor(
            Math.random() * 12
        ) + 1;

    return mcq(
        `The hour hand points to ${hour} and the minute hand points to 12. What time is it?`,
        `${hour}:00`,
        [
            `${hour}:30`,
            `${hour}:15`,
            `${hour}:45`
        ]
    );

}


// ============================
// MEASUREMENT
// ============================

function measurementQuestion() {

    const questions = [

        mcq(
            "Which is usually heavier?",
            "A school bag",
            [
                "A pencil",
                "A paper clip",
                "An eraser"
            ]
        ),

        mcq(
            "Which is usually longer?",
            "A classroom door",
            [
                "A pencil",
                "An eraser",
                "A coin"
            ]
        ),

        mcq(
            "Which container can usually hold more water?",
            "A bucket",
            [
                "A spoon",
                "A cup",
                "A bottle cap"
            ]
        )

    ];

    return questions[
        Math.floor(
            Math.random() *
            questions.length
        )
    ];

}


// ============================
// SPACE
// ============================

function spaceQuestion() {

    const questions = [

        mcq(
            "Which shape has 3 sides?",
            "Triangle",
            [
                "Square",
                "Circle",
                "Rectangle"
            ]
        ),

        mcq(
            "Which shape has no straight sides?",
            "Circle",
            [
                "Square",
                "Triangle",
                "Rectangle"
            ]
        ),

        mcq(
            "Which shape has 4 equal sides?",
            "Square",
            [
                "Triangle",
                "Circle",
                "Oval"
            ]
        )

    ];

    return questions[
        Math.floor(
            Math.random() *
            questions.length
        )
    ];

}


// ============================
// DATA
// ============================

function dataQuestion() {

    const apple =
        Math.floor(
            Math.random() * 6
        ) + 1;

    const banana =
        Math.floor(
            Math.random() * 6
        ) + 1;

    if (
        apple === banana
    ) {

        return dataQuestion();

    }

    const correct =
        apple > banana
            ? "Apples"
            : "Bananas";

    return mcq(
        `Fruit chart: Apples ${apple}, Bananas ${banana}. Which has more?`,
        correct,
        [
            correct === "Apples"
                ? "Bananas"
                : "Apples",

            "Both are equal",

            "Cannot tell"
        ]
    );

}


// ============================
// GENERATOR
// ============================

export function generateQuiz(
    topic,
    total = 10
) {

    const generators = {

        numbers:
            numberQuestion,

        operations:
            operationQuestion,

        fractions:
            fractionQuestion,

        money:
            moneyQuestion,

        time:
            timeQuestion,

        measurement:
            measurementQuestion,

        space:
            spaceQuestion,

        data:
            dataQuestion

    };

    const generator =
        generators[topic] ||
        numberQuestion;

    let quiz = [];

    for (
        let i = 0;
        i < total;
        i++
    ) {

        quiz.push(
            generator()
        );

    }

    return quiz;

}
