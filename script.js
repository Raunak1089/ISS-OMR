document.body.onclick = () => {

    //  EMERGENCY STORE THE ANSWERS ___________
    let answers = "";
    for (let i = 1; i <= 80; i++) {
        answers += `${i}. ${answer(i)}<br>`;
    }
    localStorage.setItem('OMRAnswers', answers);

    //  SHOW ANSWERED STATISTICS _______________
    let answered = 0
    for (i = 1; i <= 80; i++) if (answer(i) != '') answered++;
    document.querySelectorAll('numb')[0].innerText = answered;
    document.querySelectorAll('numb')[1].innerText = 80 - answered;
}

// Global timer variables
let timer_interval;
let timer_paused = false;
let timer_duration = 7200;

// Question tracking variables
let opened_qn = 1;
let time_per_qn = new Array(80).fill(0);
let last_qn_change_time = null;

function updateOpenedQuestion(new_qn) {
    if (new_qn < 1 || new_qn > 80) return;

    // Record time spent on previous question
    if (last_qn_change_time !== null && timer_interval) {
        const current_time = Date.now();
        const time_spent = current_time - last_qn_change_time;
        time_per_qn[opened_qn - 1] += time_spent;
    }

    // Update opened_qn
    const old_qn = opened_qn;
    opened_qn = new_qn;
    last_qn_change_time = Date.now();

    // Update row highlighting
    updateRowHighlighting(old_qn, opened_qn);
}

function updateRowHighlighting(old_qn, new_qn) {
    // Remove highlight from old row
    const old_row = document.querySelector(`tr[data-qn="${old_qn}"]`);
    if (old_row) {
        old_row.style.backgroundColor = '';
        // Reset first td text color
        const old_first_td = old_row.querySelector('td:first-child');
        if (old_first_td) {
            old_first_td.style.color = '';
        }
    }

    // Add highlight to new row
    const new_row = document.querySelector(`tr[data-qn="${new_qn}"]`);
    if (new_row) {
        new_row.style.backgroundColor = '#0c7cd5';
        // Make first td text white
        const new_first_td = new_row.querySelector('td:first-child');
        if (new_first_td) {
            new_first_td.style.color = 'white';
        }
    }
}

function formatTime(milliseconds) {
    const total_seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(total_seconds / 60);
    const seconds = total_seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function handleAnswerChange(questionNumber) {
    // Move to next question when an answer is selected
    if (questionNumber < 80) {
        updateOpenedQuestion(questionNumber + 1);
    }
    // If it's question 80, stay on 80
}

function handleRowClick(event, questionNumber) {
    // Don't change question if clicking on radio buttons or clear button
    if (event.target.type === 'radio' || event.target.type === 'button') {
        return;
    }

    // Change to clicked question
    updateOpenedQuestion(questionNumber);
}

function resetOption(i) {
    document.querySelector(`[name="question${i}"]:checked`).checked = false;
}

function completed() {
    clearInterval(timer_interval);

    // Record final time for current question
    if (last_qn_change_time !== null) {
        const current_time = Date.now();
        const time_spent = current_time - last_qn_change_time;
        time_per_qn[opened_qn - 1] += time_spent;
    }

    // Collect all answers BEFORE document.write() erases the form
    let userAnswers = [];
    for (let i = 1; i <= 80; i++) {
        userAnswers.push(answer(i));
    }

    // Make userAnswers available globally for the calculateScores function
    window.userAnswers = userAnswers;

    let correctAnswers = new Array(80).fill('');

    let resultsHTML = `
      <script src="https://raunak1089.github.io/all_scripts/fontawesome.js"></script>

<div style="padding: 20px; font-family: Arial, sans-serif;">
  <h2 style="text-align: center; margin-bottom: 20px;">Exam Results</h2>
  
  <!-- Answer Key Selection Table -->
  <div style="text-align: center; margin-bottom: 20px;">
    <table id="answerKeyTable" style="border-collapse: collapse; margin: 0 auto; display: inline-block;">
      <tr>
        <th style="padding: 4px; font-size: 0.5em;"></th>
        <th style="padding: 4px; font-size: 0.5em;">2017</th>
        <th style="padding: 4px; font-size: 0.5em;">2018</th>
        <th style="padding: 4px; font-size: 0.5em;">2019</th>
        <th style="padding: 4px; font-size: 0.5em;">2020</th>
        <th style="padding: 4px; font-size: 0.5em;">2021</th>
        <th style="padding: 4px; font-size: 0.5em;">2022</th>
      </tr>
      <tr>
        <th style="padding: 4px; font-size: 0.8em;">P I</th>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper I', '2017')"></td>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper I', '2018')"></td>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper I', '2019')"></td>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper I', '2020')"></td>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper I', '2021')"></td>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper I', '2022')"></td>
      </tr>
      <tr>
        <th style="padding: 4px; font-size: 0.8em;">P II</th>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper II', '2017')"></td>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper II', '2018')"></td>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper II', '2019')"></td>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper II', '2020')"></td>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper II', '2021')"></td>
        <td style="border: 1px solid #ddd; padding: 2px; width: 1.5em; height: 1.5em; cursor: pointer;" onclick="selectAnswerKey('Paper II', '2022')"></td>
      </tr>
    </table>
  </div>
  
  <div style="text-align: center; margin-bottom: 20px;">
    <button onclick="calculateScores()" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Check Scores</button>
  </div>
  <table id="resultsTable" style="width: 50%; border-collapse: collapse; margin-bottom: 20px; margin: 0 auto;">
    <thead>
      <tr style="background: #f8f9fa;">
        <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Q. No.</th>
        <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Your answer</th>
        <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Correct answer</th>
        <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Score</th>
        <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Time taken</th>
      </tr>
    </thead>
    <tbody>
`;

    for (let i = 1; i <= 80; i++) {
        const yourAnswer = userAnswers[i - 1];
        const timeTaken = formatTime(time_per_qn[i - 1]);
        const timeInSeconds = Math.floor(time_per_qn[i - 1] / 1000);

        // Determine color for time taken
        let timeColor = '';
        if (timeInSeconds > 0 && timeInSeconds <= 90) {
            timeColor = 'color: green;';
        } else if (timeInSeconds > 90) {
            timeColor = 'color: red;';
        }
        // timeInSeconds = 0 keeps default black color

        resultsHTML += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${i}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${yourAnswer}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" id="correct-${i}">${correctAnswers[i - 1]}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" id="score-${i}">-</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; ${timeColor}">${timeTaken}</td>
      </tr>
    `;
    }

    resultsHTML += `
    </tbody>
  </table>
  <div id="totalScoreDiv" style="margin: 15px; text-align: center; font-size: 18px; font-weight: bold; display: none; margin-bottom: 10px;">
    Total Score: <span id="totalScoreText"></span>
  </div>
  <div id="accuracyDiv" style="margin: 15px; text-align: center; font-size: 16px; display: none; margin-bottom: 20px;">
    Accuracy: <span id="accuracyText"></span>
  </div>
</div>
`;

    document.write(resultsHTML);
    document.title = "Exam Results";

    // Make functions available globally
    window.selectAnswerKey = function (paper, year) {
        // Clear previous selection
        const cells = document.querySelectorAll('#answerKeyTable td');
        cells.forEach(cell => {
            cell.style.backgroundColor = '';
        });

        // Find and highlight the clicked cell
        const table = document.getElementById('answerKeyTable');
        const rows = table.rows;
        const rowIndex = paper === 'Paper I' ? 1 : 2; // Row 1 for Paper I, Row 2 for Paper II
        const colIndex = ['2017', '2018', '2019', '2020', '2021', '2022'].indexOf(year) + 1; // +1 because first column is row header

        if (rowIndex >= 1 && colIndex >= 1) {
            rows[rowIndex].cells[colIndex].style.backgroundColor = '#4285F4';
        }

        // Load the corresponding answers
        const paperIndex = paper === 'Paper I' ? 0 : 1;
        const answers = anskeys[year][paperIndex].split(',');

        for (let i = 0; i < 80 && i < answers.length; i++) {
            correctAnswers[i] = answers[i].trim().toUpperCase();
            document.getElementById(`correct-${i + 1}`).textContent = correctAnswers[i];
        }
    };

    window.calculateScores = function () {
        let totalScore = 0;
        let attempted = 0;
        let correct = 0;

        for (let i = 1; i <= 80; i++) {
            const yourAnswer = window.userAnswers[i - 1];
            const correctAnswer = correctAnswers[i - 1];
            const scoreCell = document.getElementById(`score-${i}`);

            let score = 0;
            let bgColor = '#ffc107'; // yellow for unattempted
            let textColor = '#000'; // black text for unattempted

            if (yourAnswer !== '') {
                attempted++;

                if (yourAnswer.toUpperCase() === correctAnswer.toUpperCase()) {
                    score = 5 / 2; // +2.5
                    bgColor = '#28a745'; // green
                    textColor = '#fff'; // white text
                    correct++;
                } else {
                    score = -5 / 6; // -0.833...
                    bgColor = '#dc3545'; // red
                    textColor = '#fff'; // white text
                }
            }

            totalScore += score;

            scoreCell.textContent = score.toFixed(2);
            scoreCell.style.backgroundColor = bgColor;
            scoreCell.style.color = textColor;
            scoreCell.style.fontWeight = 'bold';
        }

        // Show total score
        const totalScoreDiv = document.getElementById('totalScoreDiv');
        const totalScoreText = document.getElementById('totalScoreText');
        totalScoreText.textContent = totalScore.toFixed(2);
        totalScoreDiv.style.display = 'block';

        // Show accuracy
        const accuracyDiv = document.getElementById('accuracyDiv');
        const accuracyText = document.getElementById('accuracyText');
        const accuracy = attempted > 0 ? ((correct / attempted) * 100).toFixed(2) : 0;
        accuracyText.textContent = `${accuracy}% (${correct}/${attempted} attempted questions correct)`;
        accuracyDiv.style.display = 'block';
    };
};


function copy(el) {
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
    document.execCommand('copy');


    function clearSelection() {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }
    }
    clearSelection();


}

function answer(i) {
    if (1 <= i && i <= 80) {
        ans = document.querySelector(`[name="question${i}"]:checked`);
        if (ans == null) return ''
        else return ans.value
    }
}


//TIMER ________________

function getTime(seconds) {
    hr = Math.floor((seconds) / 3600).toString();
    min = Math.floor(((seconds) % 3600) / 60).toString();
    sec = Math.floor(((seconds) % 3600) % 60).toString();
    if (hr.length == 1) { hr = '0' + hr; }
    if (min.length == 1) { min = '0' + min; }
    if (sec.length == 1) { sec = '0' + sec; }
    return `${hr}:${min}:${sec}`;
}

function toggleTimer() {
    if (timer_paused) {
        // Resume timer
        timer_paused = false;
        document.querySelector('timer showtime').style.color = '';
        last_qn_change_time = Date.now(); // Reset time tracking on resume
        timer_interval = setInterval(() => {
            document.querySelector('timer showtime').innerText = getTime(timer_duration);
            if (timer_duration == 0) completed();
            timer_duration--;
        }, 1000);
    } else {
        // Pause timer - record time spent before pausing
        if (last_qn_change_time !== null) {
            const current_time = Date.now();
            const time_spent = current_time - last_qn_change_time;
            time_per_qn[opened_qn - 1] += time_spent;
        }

        timer_paused = true;
        clearInterval(timer_interval);
        document.querySelector('timer showtime').style.color = 'red';
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'p' && timer_interval) {
        event.preventDefault();
        toggleTimer();
    }
});

document.querySelector('timer start').onclick = () => {
    document.querySelector('timer start').hidden = true;
    timer_duration = 7200;
    timer_paused = false;

    // Initialize question tracking
    opened_qn = 1;
    time_per_qn = new Array(80).fill(0);
    last_qn_change_time = Date.now();
    updateRowHighlighting(0, 1); // Highlight first question

    document.body.style.overflow = "auto";
    window.scrollTo(0, 0);
    document.querySelector('#omrSheet').classList.add('exam-start');
    document.querySelector('timer').classList.remove('before-start');

    timer_interval = setInterval(() => {
        document.querySelector('timer showtime').innerText = getTime(timer_duration);
        if (timer_duration == 0) completed();
        timer_duration--;
    }, 1000)
}


const calc = document.querySelector('#loadCalc');
calc.style.right = "10px";
calc.style.top = "40px";
calc.style.display = "none";

let from_x, from_y, init_x, init_y;
let dragging;
calc.onmousedown = (ev) => {
    from_x = parseInt(window.getComputedStyle(calc).getPropertyValue('left'));
    from_y = parseInt(calc.style.top);
    init_x = ev.clientX; init_y = ev.clientY;
    dragging = true;
}
document.onmouseup = () => {
    dragging = false;
}
document.onmousemove = (ev) => {
    if (dragging) {
        calc.style.left = from_x + ev.clientX - init_x + "px";
        calc.style.top = from_y + ev.clientY - init_y + "px";
    }
}

function loadCalculator() {
    if (calc.style.display == "none") {
        calc.style.display = "";
    } else {
        calc.style.display = "none";
    }
}

document.querySelector('#closeButton1').onclick = () => {
    calc.style.display = "none";
}

document.querySelector('#mainContentArea').onclick = () => { document.querySelector('#keyPad_UserInput1').value = document.querySelector('#keyPad_UserInput1').value.replaceAll(' ', '') }


let anskeys = {
    "2022": ["B,B,A,D,C,B,C,B,A,A,A,C,B,D,D,B,B,D,B,C,B,B,D,A,C,B,A,C,B,B,A,B,D,D,B,A,B,D,C,B,A,A,A,D,D,A,D,A,B,D,D,B,B,B,B,B,B,B,B,D,C,D,D,B,D,D,C,D,C,C,A,B,B,D,B,B,D,D,D,A", "B,B,C,D,C,B,D,A,A,C,C,C,A,A,C,A,A,C,C,B,D,B,A,A,C,C,A,B,D,X,X,C,D,D,C,B,B,D,B,C,B,C,B,A,C,B,B,B,B,A,B,D,C,C,C,C,D,D,A,B,D,A,C,D,A,D,D,D,B,B,A,A,C,C,C,D,C,B,A,B"],

    "2021": ["D,D,B,C,X,A,D,A,C,X,B,D,C,A,D,A,C,A,C,B,A,C,D,B,D,A,A,D,C,B,A,C,A,A,A,D,A,D,C,A,C,A,C,B,B,D,B,C,D,B,C,C,B,B,B,D,C,B,B,D,A,C,C,A,C,B,A,D,C,D,C,B,A,C,C,C,D,C,C,B", "D,A,X,C,D,C,C,B,C,B,B,C,C,B,C,A,A,C,C,A,A,B,C,C,B,B,C,A,D,A,C,C,B,D,A,A,D,B,C,C,C,D,C,A,D,D,B,A,C,C,A,B,C,D,C,C,D,A,C,B,B,D,C,D,C,B,C,C,C,D,B,B,C,D,D,D,D,B,C,D"],

    "2020": ["C,A,C,A,B,A,B,C,B,D,B,D,C,D,B,D,D,B,D,A,A,A,C,C,C,A,B,C,B,B,B,A,B,C,D,D,A,B,A,C,A,D,B,A,C,D,D,B,D,C,C,C,C,B,D,B,D,B,C,B,C,A,B,B,D,A,A,A,C,D,C,D,D,B,C,D,B,B,B,B", "A,C,C,D,D,B,C,C,B,C,C,B,B,D,C,D,A,C,A,A,C,D,B,A,A,A,B,B,A,D,A,A,B,B,C,B,B,D,C,B,C,C,B,B,C,A,B,A,D,A,D,B,C,D,C,C,D,A,A,A,C,B,B,B,A,A,A,A,C,C,C,A,C,D,A,D,D,A,D,C"],

    "2019": ["B,D,B,B,D,A,B,D,A,D,C,B,B,D,A,A,A,C,D,B,A,C,D,B,C,B,B,B,C,C,D,X,C,B,C,B,B,C,D,C,B,D,C,C,C,B,D,B,B,B,A,C,C,B,D,C,C,A,A,C,A,C,B,C,C,B,C,B,D,B,B,A,A,C,A,A,A,A,C,D", "A,D,A,B,A,A,B,A,C,D,C,B,B,C,C,A,D,X,A,A,C,B,D,B,D,A,C,B,A,C,A,A,B,D,C,A,C,D,B,A,A,A,D,B,B,A,C,C,C,C,C,D,C,C,A,B,B,B,D,B,A,C,A,C,B,C,A,D,D,D,B,A,C,C,C,C,C,A,C,B"],

    "2018": ["C,B,B,C,X,B,D,C,B,D,C,A,A,C,B,A,C,B,C,A,C,D,B,B,B,A,D,B,B,A,C,D,B,A,B,C,B,C,C,A,B,B,B,D,D,A,C,B,A,C,C,D,B,C,D,A,B,A,C,D,B,B,B,B,C,B,B,D,B,B,C,B,D,B,A,A,B,B,C,B", "C,A,D,B,C,B,D,B,C,B,C,D,C,C,A,A,B,B,A,C,C,D,D,D,D,A,B,A,A,B,A,D,A,C,D,B,C,D,C,B,B,B,D,B,B,A,C,B,C,A,B,D,B,D,C,C,A,A,C,C,C,D,D,C,D,D,X,C,D,C,C,A,A,C,C,D,D,A,A,B"],

    "2017": ["D,B,A,C,A,B,B,D,A,A,C,D,A,B,C,X,B,A,A,D,B,B,C,B,B,B,D,C,C,B,A,C,C,D,A,D,C,C,D,C,C,C,B,B,A,D,C,A,A,D,B,A,D,C,A,C,C,C,D,D,A,A,C,D,C,C,B,B,D,C,C,A,D,B,C,C,A,D,C,B", "D,A,D,C,A,D,B,A,B,C,B,C,C,A,D,X,C,D,A,A,C,D,C,B,D,D,C,B,A,B,B,C,A,B,A,D,B,C,B,C,B,D,C,C,A,B,D,B,C,C,A,D,D,B,B,B,C,A,D,B,A,B,C,A,D,D,A,D,D,B,B,A,B,A,B,D,A,A,C,A"]
}
