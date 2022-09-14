let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}


document.getElementsByClassName('testname')[0].focus();
var allInps = document.querySelectorAll('input[type=text], textarea');
for (i = 0; i < allInps.length; i++) {
  allInps[i].setAttribute("required", "true");
  allInps[i].setAttribute("autocomplete", "off");
}

function addNewSub() {
  let newSubName = String(document.getElementById('newSubName').value);
  // newSubName = newSubName.charAt(0).toUpperCase() + newSubName.substring(1).toLowerCase();
  if (newSubName != null && newSubName != "") {
    let newSub = document.createElement('label');
    newSub.className = "slide highlight";
    newSub.setAttribute('for', newSubName.toLowerCase());
    newSub.setAttribute("onClick", "chkboxcss()");
    newSub.innerText = newSubName.charAt(0).toUpperCase() + newSubName.substring(1).toLowerCase();
    newSub.innerHTML = '<input type="checkbox" checked name="techName[]" id="' + newSubName.toLowerCase() + '" value="' + newSubName.toLowerCase() + '"> ' + newSubName.charAt(0).toUpperCase() + newSubName.substring(1).toLowerCase() + '';
    document.getElementsByClassName('slider')[0].appendChild(newSub);
    document.getElementById('inputBox').parentNode.removeChild(document.getElementById('inputBox'));
    let inputbox = document.createElement('div');
    inputbox.setAttribute('id', 'inputBox');
    inputbox.style.display = "inline-block";
    inputbox.innerHTML = '<input type="text" name="" id="newSubName" class="slide" style="width: 80px; font-size: medium; margin: 0; padding: 5px 5px; border: 0; border-top-right-radius: 0; border-bottom-right-radius: 0;"><button style="border-top-right-radius: 10px; border-bottom-right-radius: 10px; margin: 0; padding: 5px;  border: 0; background-color: gray; color: white;" type="button" onclick="addNewSub()" title="add new subject">+</button>';
    document.getElementsByClassName('slider')[0].appendChild(inputbox);



    // document.getElementById('inputBox').style.display = "none";
  }
}

// function showAddInp(){
//   // document.getElementById('inputBox').style.display = "inline";
//   if (document.getElementById('inputBox') == null){
//     let box = document.createElement('div');
//   box.setAttribute("id", "inputBox");
//   box.innerHTML = '<input type="text" name="" id="newSubName" class="slide" style="width: 80px; font-size: medium; margin: 0; padding: 0 5px; border: 0; border-top-right-radius: 0; border-bottom-right-radius: 0;"><button style="border-top-right-radius: 10px; border-bottom-right-radius: 10px; margin: 0; padding: 5px; border: 0; background-color: gray; color: white;" type="button" onclick="addNewSub()" title="add new subject">+</button>';
//   document.getElementsByClassName('slider')[0].appendChild(box);
//   }

// }

function chkboxcss() {
  let chkboxes = document.querySelectorAll('input[name="techName[]"]');
  chkboxes.forEach(chkbox => {
    if (chkbox.checked) {
      chkbox.closest('label').classList.add('highlight');
    }
    else {
      chkbox.closest('label').classList.remove('highlight');
    }
  });

}

// container.classList.add('highlight');
// radioBtns.forEach((rb, ind) => {
//   if(rb.id == currentID) return;
//   rb.closest('label').classList.remove('highlight');
//   rb.checked = false;



resetTotalCount();
function resetTotalCount() {
  var n = parseInt(document.getElementsByClassName('card').length) - 1;
  var m = document.getElementsByClassName('marksCounter');
  var totMarks = 0;
  for (i = 0; i < m.length; i++) {
    totMarks += parseInt(m[i].value);
    console.log(m[i].value);
  }
  document.getElementById('totalCount').innerHTML = "<span style='color:gray'>Total questions: " + n + "<br> Total marks: " + totMarks + "</span>";
}

// function marks(){
//   var m = document.getElementsByClassName('marksCounter');
//   var totMarks = 0;
//   for (i = 0; i<m.length; i++){
//     totMarks += parseInt(m[i].value);
//   }
//   console.log(totMarks);
// }



var counterQ = 1, counterO = 1;
var questions = [];
var options = [];

function showCorrectAns(qid) {
  var inp = document.getElementById(qid).getElementsByClassName('list-group')[0].getElementsByClassName('op');
  var chk = document.getElementById(qid).getElementsByClassName('list-group')[0].getElementsByClassName('correctOption');
  for (i = 0; i < inp.length; i++) {
    if (chk[i].checked) {
      chk[i].value = inp[i].value;
      inp[i].style.backgroundColor = "#eefeff";
      inp[i].style.color = "#1F4693"
    } else {
      chk[i].value = "";
      inp[i].style.backgroundColor = "";
      inp[i].style.color = ""
    }
  }
}

// function answerKey(qid) {
//   var cards = document.getElementById(qid).getElementsByClassName("card-body");
//   var inp = cards[0].getElementsByClassName("list-group")[0].getElementsByClassName("op");
//   cards[1].getElementsByClassName("list-group")[0].innerHTML = "";
//   cards[1].style.display = "block";
//   for (i = 0; i < inp.length; i++) {
//     if (inp[i].value != null && inp[i].value != "") {
//       cards[1].getElementsByClassName("list-group")[0].innerHTML += "<li class='list-group-item'><label for=" + inp[i].value + ">" + inp[i].value + "</label><input type='checkbox' name='" + parseInt(qid.slice(10)) + "[2][]' id='" + inp[i].value + "' value='" + inp[i].value + "' ></li>";
//     }
//   }
// }

function addQuestion
  () {
  var newdiv = document.createElement('div');
  newdiv.setAttribute('id', 'questions[' + counterQ + ']');
  newdiv.classList.add("card");
  var remQFun = 'removeOption("questions[' + counterQ + ']")';
  var remOFun = 'removeOption("options[' + counterO + ']")';
  var addOFun = 'addOption("questions[' + counterQ + ']");';
  var ansKey = 'answerKey("questions[' + counterQ + ']")';
  var ansK = 'showCorrectAns("questions[' + counterQ + ']")';
  newdiv.innerHTML = "<div class='card-body'><div class='d-flex'><input type='text' name='" + counterQ + "[0]' placeholder='Question' class='question flex-grow-1' style='padding:10px; border-radius: 4px'><div class='align-self-center marksdiv' ><input type='number' value='0'  name='" + counterQ + "[3]' class='marksCounter' onclick='resetTotalCount()'> <label for='marksCounter'>mark(s)</label></div><button type='button' class='removeQuestion' title='delete question' onClick=" + remQFun + "><i class='fa-solid fa-trash-can'></i></button></div> <ul class='list-group list-group-numbered'><li class='list-group-item' id='options[" + counterO + "]'> <input type='text' class='op' name='" + counterQ + "[1][]' placeholder='Option' style='padding-left:5px; border-radius: 4px'> <input type='checkbox' class='correctOption' name='" + counterQ + "[2][]' onclick=" + ansK + "> <button type='button' class='removeOption' onClick=" + remOFun + "><i class='fa-solid fa-xmark'></i></button></li></ul><input type='button' class='add-op-btn' value='+Add option' onClick=" + addOFun + "></div>";
  document.getElementById('formulario').appendChild(newdiv);
  newdiv.getElementsByClassName('question')[0].focus();
  counterQ++;
  counterO++;
  resetTotalCount();
}

function removeQuestion(id) {
  var elem = document.getElementById(id);
  elem.parentNode.removeChild(elem);
  resetTotalCount();
}

function addOption(qid) {
  var newdiv = document.createElement('li');
  newdiv.className = "list-group-item";
  newdiv.setAttribute('id', 'options[' + counterO + ']');
  var remQFun = 'removeOption("options[' + counterO + ']")';
  var ansK = 'showCorrectAns("' + qid + '")';
  newdiv.innerHTML = "<input type='text' class='op' placeholder='Option' style='padding-left:5px; border-radius: 4px' name='" + parseInt(qid.slice(10)) + "[1][]'> <input type='checkbox' class='correctOption' name='" + parseInt(qid.slice(10)) + "[2][]' onclick=" + ansK + "> <button type='button' class='removeOption'  onClick=" + remQFun + "><i class='fa-solid fa-xmark'></i></button>";
  document.getElementById(qid).getElementsByClassName('list-group')[0].appendChild(newdiv);
  newdiv.getElementsByClassName('op')[0].focus();
  counterO++;
}

function removeOption(qid) {
  var elem = document.getElementById(qid);
  return elem.parentNode.removeChild(elem);
}