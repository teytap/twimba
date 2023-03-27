import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

localStorage.clear();

const feed = document.getElementById("feed");

if (localStorage.getItem("localData") === null) {
  localStorage.setItem("localData", JSON.stringify(tweetsData));
}

const mainData = JSON.parse(localStorage.getItem("localData"));

document.addEventListener("click", function (e) {
  if (e.target.dataset.likes) {
    handleLikeClick(e.target.dataset.likes);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleRepliesClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.delete) {
    handleDeleteTweet(e.target.dataset.delete);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = mainData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];
  targetTweetObj.isLiked ? targetTweetObj.likes-- : targetTweetObj.likes++;
  targetTweetObj.isLiked = !targetTweetObj.isLiked;

  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = mainData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];
  targetTweetObj.isRetweeted
    ? targetTweetObj.retweets--
    : targetTweetObj.retweets++;
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleRepliesClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}
function handleDeleteTweet() {
  mainData.shift();
  localStorage.setItem("localData", JSON.stringify(mainData));
  render();
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    let newTweetObject = {
      handle: "@Scrimba",
      profilePic: "images/scrimbalogo.png",
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
      isUser: true,
    };
    mainData.unshift(newTweetObject);
    localStorage.setItem("localData", JSON.stringify(mainData));

    tweetInput.value = "";
    render();
  }
}

function getFeedHtml() {
  let feedHtml = "";

  mainData.forEach(function (tweets) {
    let likeIconClass = tweets.isLiked ? "liked" : "";
    let retweetIconClass = tweets.isRetweeted ? "retweeted" : "";
    console.log(tweets.isUser);
    let deleteIconClass = tweets.isUser ? "" : "hide";
    let repliesHtml = "";

    if (tweets.replies.length > 0) {
      tweets.replies.forEach(function (reply) {
        repliesHtml += `<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>`;
      });
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweets.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweets.handle}</p>
            <p class="tweet-text">${tweets.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-reply="${tweets.uuid}"></i>
                   ${tweets.replies.length}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-heart ${likeIconClass}" data-likes="${tweets.uuid}"></i>
                    ${tweets.likes}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweets.uuid}"></i>
                    ${tweets.retweets}
                </span>
                <span class="tweet-detail  ${deleteIconClass}">
                <i class="fa-solid fa-trash-can" data-delete="${tweets.uuid}"></i>
                    
                </span>
                
            </div>   
        </div>            
    </div>
     <div class="hidden" id="replies-${tweets.uuid}">
        ${repliesHtml}
    </div>   
</div>`;
  });

  return feedHtml;
}

function render() {
  feed.innerHTML = getFeedHtml();
}
render();
