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

function resetOption(i) {
    document.querySelector(`[name="question${i}"]:checked`).checked = false;
}

function completed() {
    clearInterval(timer_interval);

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
  <div style="text-align: center; margin-bottom: 20px;">
    <button onclick="calculateScores()" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Check Scores</button>
  </div>
  <table id="resultsTable" style="width: 50%; border-collapse: collapse; margin-bottom: 20px; margin: 0 auto;">
    <thead>
      <tr style="background: #f8f9fa;">
        <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Q. No.</th>
        <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Your answer</th>
        <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">
          Correct answer
          <button onclick="pasteCorrectAnswers()" style="margin-left: 10px; background: none; border: none; cursor: pointer; color: #007bff;">
            <i class="fas fa-paste"></i>
          </button>
        </th>
        <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Score</th>
      </tr>
    </thead>
    <tbody>
`;

    for (let i = 1; i <= 80; i++) {
        const yourAnswer = userAnswers[i - 1];
        resultsHTML += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${i}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${yourAnswer}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" id="correct-${i}">${correctAnswers[i - 1]}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" id="score-${i}">-</td>
      </tr>
    `;
    }

    resultsHTML += `
    </tbody>
  </table>
  <div id="accuracyDiv" style="margin: 15px; text-align: center; font-size: 16px; display: none; margin-bottom: 20px;">
    Accuracy: <span id="accuracyText"></span>
  </div>
</div>
`;

    document.write(resultsHTML);
    document.title = "Exam Results";

    // Make functions available globally
    window.pasteCorrectAnswers = async function () {
        try {
            const text = await navigator.clipboard.readText();
            const answers = text.split(',');
            answers.forEach((ans, index) => {
                if (index < 80) {
                    correctAnswers[index] = ans.trim().toUpperCase();
                    document.getElementById(`correct-${index + 1}`).textContent = correctAnswers[index];
                }
            });
        } catch (err) {
            alert('Failed to read clipboard. Please make sure you have granted clipboard permissions.');
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



document.querySelector('timer start').onclick = () => {
    document.querySelector('timer start').hidden = true;
    let duration = 7200;

    document.body.style.overflow = "auto";
    window.scrollTo(0, 0);
    document.querySelector('#omrSheet').classList.add('exam-start');
    document.querySelector('timer').classList.remove('before-start');

    timer_interval = setInterval(() => {
        document.querySelector('timer showtime').innerText = getTime(duration);
        if (duration == 0) completed();
        duration--;
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