const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/sum', (req,res) => {
    const firstInteger = Number(req.query.a);
    const secondInteger = Number(req.query.b);
    const totalSum = firstInteger + secondInteger;
    if(!firstInteger) {
        return res.status(400).send('a is required');
    } else if(firstInteger.isNan) {
        return res.status(400).send('a needs to be a number');
    }
    if(!secondInteger) {
        return res.status(400).send('b is required');
    } else if(secondInteger.isNan) {
        return res.status(400).send('b needs to be a number');
    }
    res.send(`The sum of ${firstInteger} and ${secondInteger} is ${totalSum}.`);
});

app.get('/cipher', (req,res) => {
    const {text, shift} = req.query;
    //Validations for requiring parameters, and shift value type.
    if(!text)  {
        return res.status(400).send('text is required');
    }
    if(!shift) {
        return res.status(400).send('shift is requried');
    }
    const textShift = parseFloat(shift);
    if(Number.isNan(textShift)) {
        return res.status(400).send('shift needs to be a number');
    }

    const base = 'A'.charCodeAt(0);  //base is the character code
    const cipher = text
        .toUpperCase()
        .split('') //create array of characters from string by separting with no space.
        .map(char => { //map over each character to the converted char
            const code = char.charCodeAt(0); //this is getting the char code for that specific char
            //if char code is outside of alphabet ignore
            if(code < base || code > (base + 26)) {
                return char;
            }
            //then convert code and get distance from "A"
            let diff = code - base;
            diff = diff + numShift;
            //in case the shift takes past Z return back to A value
            diff = diff % 26;

            const shiftChar = String.fromCharCode(base + diff);
            return shiftChar;
        })
        .join(''); //constructing string by rejoining array of characters
    res.status(200).send(cipher);
});

app.get('/lotto', (req,res) => {
    const { lottoTicket } = req.query;
    //Validation: array must exist, must be array, 6 numbers required, #'s must be between 1-20
    if(lottoTicket.length < 6) {
        return res.status(400).send('6 numbers are required.')
    };
    if(!lottoTicket) {
        return res.status(400).send('lottoTicket is required')
    }
    if(!Array.isArray(lottoTicket)) {
        return res.status(400).send('lottoTicket must be an array')
    }
    const numbers = lottoTicket
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

    //numbers to choose from 1-20; this is an array with values from 1-20
    const stockNumbers = Array(20).fill(1).map((_,i) => i + 1)
    const lottoArray = [];
    for(i=0; i < 6; i++) {
        const getRandomNumber = Math.floor(Math.random() * stockNumbers.length);
        lottoArray.push(stockNumbers[getRandomNumber]);
        stockNumbers.splice(getRandomNumber, 1); //splice removes generate # from the array of answers.
    }
    let diff = lottoArray.filter(n => !numbers.includes(n));
    let responseText;

    switch(diff.length) {
        case 0:
            responseText = 'You have won the mega million!';
            break;
        case 1:
            responseText = 'Congrats! You won $100!';
            break;
        case 2: 
            responseText = 'Congrats! You won a free ticket!';
            break;
        default:
            responseText = 'Sorry, you lost.';
    }
})

app.listen(8000, () => {
    console.log('Express server is listening on port 8000.');
});



/* 
app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheeseburgers');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way');
});

app.get('/pizza/pineapple', (req, res) => {
    res.send('We do not serve that here. Never call again!');
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
        Base URL: ${req.baseUrl}
        Host: ${req.hostname}
        Path: ${req.path}
    `;
    res.send(responseText);
})

app.get('/greetings', (req,res) => {
    const name = req.query.name;
    const race = req.query.race;

    if(!name) {
        return res.status(400).send('Please provide a name');
    } 
    if(!race) {
        return res.status(400).send('Please provide a race');
    }
    const greeting = `Grettings ${name} the ${race}, welcome to our kingdom`;
    res.send(greeting);
});
*/