document.addEventListener("DOMContentLoaded", () => {
    const cellTab = document.querySelector("#find_sell");
    const emailTab = document.querySelector("#find_mail");
    const cellInput = document.querySelector("#li_cell");
    const emailInput = document.querySelector("#li_mail");
    const enterMail = document.querySelector(".box_input > #email");
    const showAddress = document.querySelector(".suggest_email");
    const emailLinks = document.querySelectorAll(".link_email");
    const suggestionItems = document.querySelectorAll(".txt_email");

    const idInput = document.querySelector("#id");
    const idMessage = document.querySelector("#msg_id");
    const nameInput = document.querySelector("#name");
    const nameMessage = document.querySelector("#msg_name");
    const birthdayInput = document.querySelector("#birthday");
    const birthdayMessage = document.querySelector("#msg_birthday");
    const cellNumberInput = document.querySelector("#cell");
    const cellNumberMessage = document.querySelector("#msg_cell");
    const userEmailInput = document.querySelector("#email");
    const userEmailMessage = document.querySelector("#msg_mail");
    const certInput = document.querySelector("#findCite");
    const certMessageFail = document.querySelector("#msg_cert_num_fail");
    const expiredMessage = document.querySelector("#msg_cert_num");

    let timer;
    const certButton = document.querySelector("#li_cell .btn_cert");
    const emailSendButton = document.querySelector("#li_mail .btn_cert");
    const timeDisplay = document.querySelector(".time_find");
    const remainTimeText = document.querySelector("#confirm_remain_time");
    const sendSMSMessage = document.querySelector("#msg_cell1");
    const sendEmailMessage = document.querySelector("#msg_mail_sent");
    const certConfirmButton = document.querySelector("#btn_cert_complete");
    const certSuccessMessage = document.querySelector(".message_find.ok");

    console.log(emailLinks);

    // 탭 전환 이벤트
    cellTab.addEventListener("click", () => toggleTabs(true));
    emailTab.addEventListener("click", () => toggleTabs(false));

    const toggleTabs = (isCell) => {
        // 클래스 'on' 추가 및 제거
        cellTab.classList.toggle("on", isCell);
        emailTab.classList.toggle("on", !isCell);

        // 휴대폰 번호와 이메일 입력란의 활성화 및 비활성화
        cellInput.style.display = isCell ? "block" : "none";
        emailInput.style.display = isCell ? "none" : "block";
    };

    // 이메일 입력 시 나타나는 @~ 주소창
    enterMail.addEventListener("input", () => {
        if (enterMail.value) {
            showAddress.style.display = "block";
            updateEmailSuggestions(enterMail.value);
        } else {
            showAddress.style.display = "none";
        }
    });

    // 이메일 자동완성 리스트 업데이트 함수
    const updateEmailSuggestions = (inputValue) => {
        suggestionItems.forEach((item) => {
            item.textContent = inputValue; // 사용자가 입력한 값을 자동완성 텍스트로 설정
        });
    };

    // 자동완성 리스트 항목 클릭 시 입력란에 값 자동 완성
    emailLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const emailPart = link
                .querySelector(".txt_email")
                .textContent.trim(); // 공백 제거
            const domainPart = link.textContent.replace(emailPart, "").trim(); // 도메인 부분에서 공백 제거
            enterMail.value = `${emailPart}${domainPart}`; // 이메일 주소 결합
            showAddress.style.display = "none";
        });
    });

    // *********아이디 유효성 검사 함수************
    const validateId = () => {
        const idPattern = /^[a-zA-Z0-9_]{4,20}$/; // 아이디 형식: 영문, 숫자, 밑줄 포함 4~20자
        if (idPattern.test(idInput.value)) {
            idMessage.style.display = "none"; // 유효하면 메시지 숨기기
        } else {
            idMessage.style.display = "block"; // 유효하지 않으면 메시지 표시
        }
    };

    idInput.addEventListener("input", validateId);

    // ***********이름 유효성 검사 함수***************
    const validateName = () => {
        const namePattern = /^[가-힣a-zA-Z\s]+$/; // 이름 형식: 한글, 영문만 허용
        if (namePattern.test(nameInput.value)) {
            nameMessage.style.display = "none";
        } else {
            nameMessage.style.display = "block";
        }
    };

    nameInput.addEventListener("input", validateName);

    // *************** 생년월일 유효성 검사 함수 *************
    const validateBirthday = () => {
        const birthdayPattern = /^\d{8}$/;
        if (birthdayPattern.test(birthdayInput.value)) {
            birthdayMessage.style.display = "none";
        } else {
            birthdayMessage.style.display = "block";
        }
    };

    birthdayInput.addEventListener("input", validateBirthday);

    // *************** 휴대폰 번호 유효성 검사 함수 *************
    const validateCell = () => {
        const cellNumberPattern = /^\d{11}$/;
        if (cellNumberPattern.test(cellNumberInput.value)) {
            cellNumberMessage.style.display = "none";
        } else {
            cellNumberMessage.style.display = "block";
        }
    };

    cellNumberInput.addEventListener("input", validateCell);

    // *************** 이메일 유효성 검사 함수 *************
    const validateEmail = () => {
        const emailPattern = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        if (emailPattern.test(userEmailInput.value)) {
            userEmailMessage.style.display = "none";
        } else {
            userEmailMessage.style.display = "block";
        }
    };

    userEmailInput.addEventListener("input", validateEmail);

    // 인증번호 발송 버튼 클릭 이벤트 - 휴대폰
    certButton.addEventListener("click", () => {
        if (checkAllInputsValid("cell")) {
            sendSMSMessage.style.display = "block";
            startCountdown();
        }
    });

    // 인증번호 발송 버튼 클릭 이벤트 - 이메일
    emailSendButton.addEventListener("click", () => {
        if (checkAllInputsValid("email")) {
            sendEmailMessage.style.display = "block";
            startCountdown();
        }
    });

    // 인증 확인 버튼 클릭 이벤트
    certConfirmButton.addEventListener("click", () => {
        if (!certInput.value) {
            alert("인증번호를 입력해 주세요.");
            certInput.focus();
        } else {
            clearInterval(timer);
            timeDisplay.style.display = "none";
            certSuccessMessage.style.display = "block";
            alert("인증이 완료되었습니다.");
        }
    });

    // ******************** 인증번호 타이머 *************************
    const startCountdown = () => {
        let timeRemaining = 180;

        clearInterval(timer);
        timeDisplay.style.display = "block";
        expiredMessage.style.display = "none";

        timer = setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;

            remainTimeText.textContent = `${minutes}:${
                seconds < 10 ? "0" : ""
            }${seconds}`;

            if (timeRemaining <= 0) {
                clearInterval(timer);
                timeDisplay.style.display = "none";
                expiredMessage.style.display = "block";
            }

            timeRemaining--;
        }, 1000);
    };

    // ***************** 입력값 유효성 검사 함수 *****************
    const checkAllInputsValid = (type) => {
        if (!idInput.value) {
            alert("아이디를 입력해 주세요.");
            idInput.focus();
            return false;
        }
        if (!nameInput.value) {
            alert("이름을 입력해 주세요.");
            nameInput.focus();
            return false;
        }
        if (!birthdayInput.value) {
            alert("생년월일을 입력해 주세요.");
            birthdayInput.focus();
            return false;
        }

        if (type === "cell" && !cellNumberInput.value) {
            alert("휴대폰 번호를 입력해 주세요.");
            cellNumberInput.focus();
            return false;
        }

        if (type === "email" && !userEmailInput.value) {
            alert("이메일 주소를 입력해 주세요.");
            userEmailInput.focus();
            return false;
        }

        return true;
    };
});
