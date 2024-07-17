const cards = document.querySelectorAll(".card"),
timeTag = document.querySelector(".time b"),
flipsTag = document.querySelector(".flips b"),
refreshBtn = document.querySelector(".details button");
resultBox = document.querySelector(".result"),
resultMessage = document.querySelector(".result-message");

// Khởi tạo các biến cho trò chơi
let maxTime = 20;
let timeLeft = maxTime;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;

// Hàm khởi tạo bộ đếm thời gian
function initTimer() {
    if (timeLeft <= 0) {
        return clearInterval(timer); // Dừng bộ đếm thời gian khi hết giờ
    }
    timeLeft--; // Giảm thời gian còn lại
    timeTag.innerText = timeLeft; // Cập nhật thẻ thời gian trên giao diện
}

// Hàm lật thẻ
function flipCard({target: clickedCard}) {
    if (!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000); // Bắt đầu bộ đếm thời gian khi trò chơi bắt đầu
    }
    if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips; // Cập nhật số lần lật trên giao diện
        clickedCard.classList.add("flip"); // Thêm lớp "flip" để lật thẻ
        if (!cardOne) {
            return cardOne = clickedCard; // Gán thẻ đầu tiên
        }
        cardTwo = clickedCard; // Gán thẻ thứ hai
        disableDeck = true; // Vô hiệu hóa việc lật thêm thẻ cho đến khi so khớp xong
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg); // Kiểm tra xem hai thẻ có khớp nhau không
    }
}

// Hàm kiểm tra và xử lý khi thẻ khớp hoặc không khớp
function matchCards(img1, img2) {
    if (img1 === img2) {
        matchedCard++;
        if (matchedCard == 6 && timeLeft > 0) {
            return clearInterval(timer); // Dừng bộ đếm thời gian khi tất cả các thẻ đều khớp
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }

    // Thêm hiệu ứng "shake" khi hai thẻ không khớp
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    // Lật lại các thẻ sau khi không khớp
    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

// Hàm trộn lại các thẻ
function shuffleCard() {
    timeLeft = maxTime;
    flips = matchedCard = 0;
    cardOne = cardTwo = "";
    clearInterval(timer);
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    disableDeck = isPlaying = false;

    let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1); // Trộn ngẫu nhiên mảng chứa các giá trị thẻ

    cards.forEach((card, index) => {
        card.classList.remove("flip"); // Loại bỏ lớp "flip" khỏi tất cả các thẻ
        let imgTag = card.querySelector(".back-view img");
        setTimeout(() => {
            imgTag.src = `images/img-${arr[index]}.png`; // Gán lại hình ảnh cho thẻ sau khi trộn
        }, 500);
        card.addEventListener("click", flipCard); // Thêm sự kiện lật thẻ
    });
}
//hiển thị kết quả
function showResult(message) {
    resultMessage.innerText = message;
    resultBox.style.display = "block";
}

function restartGame() {
    shuffleCard();
}

// Khởi động trò chơi bằng cách trộn thẻ
shuffleCard();

// Thêm sự kiện làm mới trò chơi cho nút làm mới
refreshBtn.addEventListener("click", shuffleCard);

// Thêm sự kiện lật thẻ cho tất cả các thẻ
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});
