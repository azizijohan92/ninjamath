/* =========================================
   NINJAMATH QUESTION ENGINE
========================================= */


function randomInt(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (
            max - min + 1
        )
    ) + min;

}



function shuffle(
    array
) {

    const copy =
        [...array];


    for (
        let i =
            copy.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (
                    i + 1
                )
            );


        [
            copy[i],
            copy[j]
        ]
        =
        [
            copy[j],
            copy[i]
        ];

    }


    return copy;

}



function makeMCQ(
    question,
    correct,
    wrongAnswers
) {

    const correctString =
        String(correct);


    const uniqueAnswers =
        [
            correctString,
            ...wrongAnswers.map(
                String
            )
        ]
        .filter(
            (
                value,
                index,
                self
            ) =>
                self.indexOf(
                    value
                ) === index
        );


    while (
        uniqueAnswers.length < 4
    ) {

        uniqueAnswers.push(
            String(
                uniqueAnswers.length +
                randomInt(
                    1,
                    9
                )
            )
        );

    }


    return {

        question,

        correct:
            correctString,

        answers:
            shuffle(
                uniqueAnswers.slice(
                    0,
                    4
                )
            )

    };

}



/* =========================================
   NUMBER NINJA
========================================= */

function numberQuestion() {

    const type =
        randomInt(
            1,
            7
        );


    /* AFTER NUMBER */

    if (
        type === 1
    ) {

        const n =
            randomInt(
                0,
                98
            );


        return makeMCQ(

            `What number comes after ${n}?`,

            n + 1,

            [
                n - 1,
                n + 2,
                n + 10
            ]

        );

    }



    /* BEFORE NUMBER */

    if (
        type === 2
    ) {

        const n =
            randomInt(
                2,
                100
            );


        return makeMCQ(

            `What number comes before ${n}?`,

            n - 1,

            [
                n + 1,
                n - 2,
                Math.max(
                    0,
                    n - 10
                )
            ]

        );

    }



    /* GREATER NUMBER */

    if (
        type === 3
    ) {

        let a =
            randomInt(
                1,
                100
            );

        let b =
            randomInt(
                1,
                100
            );


        while (
            a === b
        ) {

            b =
                randomInt(
                    1,
                    100
                );

        }


        const answer =
            Math.max(
                a,
                b
            );


        return makeMCQ(

            `Which number is greater: ${a} or ${b}?`,

            answer,

            [
                Math.min(
                    a,
                    b
                ),

                Math.max(
                    0,
                    answer - 1
                ),

                Math.min(
                    100,
                    answer + 1
                )
            ]

        );

    }



    /* SMALLER NUMBER */

    if (
        type === 4
    ) {

        let a =
            randomInt(
                1,
                100
            );

        let b =
            randomInt(
                1,
                100
            );


        while (
            a === b
        ) {

            b =
                randomInt(
                    1,
                    100
                );

        }


        const answer =
            Math.min(
                a,
                b
            );


        return makeMCQ(

            `Which number is smaller: ${a} or ${b}?`,

            answer,

            [
                Math.max(
                    a,
                    b
                ),

                Math.max(
                    0,
                    answer - 1
                ),

                answer + 1
            ]

        );

    }



    /* TENS */

    if (
        type === 5
    ) {

        const tens =
            randomInt(
                1,
                9
            );


        const ones =
            randomInt(
                0,
                9
            );


        const number =
            tens * 10 +
            ones;


        return makeMCQ(

            `How many tens are in ${number}?`,

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



    /* ONES */

    if (
        type === 6
    ) {

        const tens =
            randomInt(
                1,
                9
            );


        const ones =
            randomInt(
                0,
                9
            );


        const number =
            tens * 10 +
            ones;


        return makeMCQ(

            `What is the ones digit in ${number}?`,

            ones,

            [
                tens,
                Math.min(
                    9,
                    ones + 1
                ),
                Math.max(
                    0,
                    ones - 1
                )
            ]

        );

    }



    /* MISSING NUMBER */

    const start =
        randomInt(
            1,
            95
        );


    const answer =
        start + 2;


    return makeMCQ(

        `${start}, ${start + 1}, ?, ${start + 3}`,

        answer,

        [
            start,
            start + 1,
            start + 3
        ]

    );

}



/* =========================================
   OPERATION NINJA
========================================= */

function operationQuestion() {

    const type =
        randomInt(
            1,
            4
        );


    /* SIMPLE ADDITION */

    if (
        type === 1
    ) {

        const a =
            randomInt(
                0,
                50
            );


        const b =
            randomInt(
                0,
                100 - a
            );


        const answer =
            a + b;


        return makeMCQ(

            `${a} + ${b} = ?`,

            answer,

            [
                answer + 1,

                Math.max(
                    0,
                    answer - 1
                ),

                Math.min(
                    100,
                    answer + 10
                )
            ]

        );

    }



    /* SUBTRACTION */

    if (
        type === 2
    ) {

        const a =
            randomInt(
                1,
                100
            );


        const b =
            randomInt(
                0,
                a
            );


        const answer =
            a - b;


        return makeMCQ(

            `${a} − ${b} = ?`,

            answer,

            [
                answer + 1,

                Math.max(
                    0,
                    answer - 1
                ),

                answer + 2
            ]

        );

    }



    /* MISSING ADDEND */

    if (
        type === 3
    ) {

        const a =
            randomInt(
                1,
                20
            );


        const b =
            randomInt(
                1,
                20
            );


        const total =
            a + b;


        return makeMCQ(

            `${a} + ? = ${total}`,

            b,

            [
                Math.max(
                    0,
                    b - 1
                ),

                b + 1,

                a
            ]

        );

    }



    /* WORD PROBLEM */

    const apples =
        randomInt(
            1,
            10
        );


    const extra =
        randomInt(
            1,
            10
        );


    const total =
        apples + extra;


    return makeMCQ(

        `A ninja has ${apples} stars and gets ${extra} more. How many stars does the ninja have now?`,

        total,

        [
            total - 1,
            total + 1,
            apples
        ]

    );

}



/* =========================================
   FRACTION NINJA
========================================= */

function fractionQuestion() {

    const questions = [

        makeMCQ(

            "One of two equal parts is called...",

            "One half",

            [
                "One quarter",
                "One whole",
                "Two wholes"
            ]

        ),


        makeMCQ(

            "How many halves make one whole?",

            "2",

            [
                "1",
                "3",
                "4"
            ]

        ),


        makeMCQ(

            "How many quarters make one whole?",

            "4",

            [
                "1",
                "2",
                "3"
            ]

        ),


        makeMCQ(

            "Which fraction is bigger?",

            "One half",

            [
                "One quarter",
                "They are equal",
                "Zero"
            ]

        ),


        makeMCQ(

            "A pizza is cut into 2 equal pieces. One piece is...",

            "One half",

            [
                "One quarter",
                "One whole",
                "Four quarters"
            ]

        ),


        makeMCQ(

            "A cake is divided into 4 equal pieces. One piece is...",

            "One quarter",

            [
                "One half",
                "One whole",
                "Two wholes"
            ]

        )

    ];


    return questions[
        randomInt(
            0,
            questions.length - 1
        )
    ];

}



/* =========================================
   MONEY NINJA
========================================= */

function moneyQuestion() {

    const type =
        randomInt(
            1,
            4
        );


    if (
        type === 1
    ) {

        const a =
            randomInt(
                1,
                10
            );


        const b =
            randomInt(
                1,
                10
            );


        const total =
            a + b;


        return makeMCQ(

            `You have RM${a} and get RM${b} more. How much money do you have?`,

            `RM${total}`,

            [
                `RM${Math.max(
                    0,
                    total - 1
                )}`,

                `RM${total + 1}`,

                `RM${a}`
            ]

        );

    }



    if (
        type === 2
    ) {

        const money =
            randomInt(
                5,
                20
            );


        const cost =
            randomInt(
                1,
                money
            );


        const balance =
            money - cost;


        return makeMCQ(

            `You have RM${money}. You spend RM${cost}. How much is left?`,

            `RM${balance}`,

            [
                `RM${balance + 1}`,

                `RM${Math.max(
                    0,
                    balance - 1
                )}`,

                `RM${money}`
            ]

        );

    }



    if (
        type === 3
    ) {

        const sen =
            [
                5,
                10,
                20,
                50
            ];


        const answer =
            sen[
                randomInt(
                    0,
                    sen.length - 1
                )
            ];


        return makeMCQ(

            `${answer} sen is written as...`,

            `${answer} sen`,

            sen
                .filter(
                    value =>
                        value !== answer
                )
                .map(
                    value =>
                        `${value} sen`
                )

        );

    }



    return makeMCQ(

        "Which unit is used for Malaysian money?",

        "Ringgit and Sen",

        [
            "Dollar and Cent",
            "Pound and Pence",
            "Yen only"
        ]

    );

}



/* =========================================
   TIME NINJA
========================================= */

function timeQuestion() {

    const type =
        randomInt(
            1,
            4
        );


    if (
        type === 1
    ) {

        const hour =
            randomInt(
                1,
                12
            );


        return makeMCQ(

            `The minute hand points to 12 and the hour hand points to ${hour}. What time is it?`,

            `${hour}:00`,

            [
                `${hour}:30`,
                `${hour}:15`,
                `${hour}:45`
            ]

        );

    }



    if (
        type === 2
    ) {

        return makeMCQ(

            "Which activity usually happens in the morning?",

            "Eat breakfast",

            [
                "Sleep at night",
                "Eat dinner",
                "Look at stars at midnight"
            ]

        );

    }



    if (
        type === 3
    ) {

        return makeMCQ(

            "Which comes after Tuesday?",

            "Wednesday",

            [
                "Monday",
                "Friday",
                "Sunday"
            ]

        );

    }



    return makeMCQ(

        "How many days are there in one week?",

        "7",

        [
            "5",
            "6",
            "8"
        ]

    );

}



/* =========================================
   MEASUREMENT NINJA
========================================= */

function measurementQuestion() {

    const questions = [

        makeMCQ(

            "Which object is usually longer?",

            "A classroom door",

            [
                "A pencil",
                "An eraser",
                "A coin"
            ]

        ),


        makeMCQ(

            "Which object is usually heavier?",

            "A school bag",

            [
                "A paper clip",
                "A pencil",
                "An eraser"
            ]

        ),


        makeMCQ(

            "Which container can usually hold more water?",

            "A bucket",

            [
                "A spoon",
                "A bottle cap",
                "A small cup"
            ]

        ),


        makeMCQ(

            "Which word describes an object with less mass?",

            "Lighter",

            [
                "Longer",
                "Heavier",
                "Taller"
            ]

        ),


        makeMCQ(

            "Which word describes a container with more liquid?",

            "More",

            [
                "Shorter",
                "Lighter",
                "Smaller number"
            ]

        )

    ];


    return questions[
        randomInt(
            0,
            questions.length - 1
        )
    ];

}



/* =========================================
   SHAPE NINJA
========================================= */

function spaceQuestion() {

    const questions = [

        makeMCQ(

            "Which shape has 3 sides?",

            "Triangle",

            [
                "Circle",
                "Square",
                "Rectangle"
            ]

        ),


        makeMCQ(

            "Which shape has no straight sides?",

            "Circle",

            [
                "Square",
                "Triangle",
                "Rectangle"
            ]

        ),


        makeMCQ(

            "Which shape has 4 equal sides?",

            "Square",

            [
                "Triangle",
                "Circle",
                "Oval"
            ]

        ),


        makeMCQ(

            "A ball is most similar to which 3D shape?",

            "Sphere",

            [
                "Cube",
                "Cuboid",
                "Cylinder"
            ]

        ),


        makeMCQ(

            "A dice is most similar to which 3D shape?",

            "Cube",

            [
                "Sphere",
                "Cylinder",
                "Cone"
            ]

        ),


        makeMCQ(

            "A drink can is most similar to which 3D shape?",

            "Cylinder",

            [
                "Cube",
                "Sphere",
                "Pyramid"
            ]

        )

    ];


    return questions[
        randomInt(
            0,
            questions.length - 1
        )
    ];

}



/* =========================================
   DATA NINJA
========================================= */

function dataQuestion() {

    const type =
        randomInt(
            1,
            3
        );


    let apples =
        randomInt(
            1,
            8
        );


    let bananas =
        randomInt(
            1,
            8
        );


    while (
        apples === bananas
    ) {

        bananas =
            randomInt(
                1,
                8
            );

    }



    if (
        type === 1
    ) {

        const correct =
            apples > bananas
                ? "Apples"
                : "Bananas";


        return makeMCQ(

            `Fruit chart: Apples = ${apples}, Bananas = ${bananas}. Which fruit has more?`,

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



    if (
        type === 2
    ) {

        const correct =
            apples < bananas
                ? "Apples"
                : "Bananas";


        return makeMCQ(

            `Fruit chart: Apples = ${apples}, Bananas = ${bananas}. Which fruit has fewer?`,

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



    const total =
        apples + bananas;


    return makeMCQ(

        `There are ${apples} apples and ${bananas} bananas. How many fruits altogether?`,

        total,

        [
            total + 1,
            Math.max(
                0,
                total - 1
            ),
            apples
        ]

    );

}



/* =========================================
   GENERATE QUIZ
========================================= */

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
        generators[
            topic
        ]
        ||
        numberQuestion;


    const quiz =
        [];


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
