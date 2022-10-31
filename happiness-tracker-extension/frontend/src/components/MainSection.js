import { useState } from "react";
import Settings from "./Settings";
import DailyQuestion from "./DailyQuestion";
import Plan from "./Plan";
import WeatherTime from "./WeatherTime";
import QuoteOrBible from "./QuoteOrBible";
import styles from "./MainSection.module.css";

const MainSection = ({
  user,
  isLoggedIn,
  wantToSignUp,
  today,
  todayParsed,
  tomorrowDate,
  tomorrowDateParsed,
  yyyy,
  mm,
  dd,
  dailyQuestion,
}) => {
  // determines whether to display quote or bible

  const [answerToDailyQuestion, setAnswerToDailyQuestion] = useState("");

  const answerForDailyQuestion = (value) => {
    setAnswerToDailyQuestion(value);
  };
  const displayQuoteOrBible = (whatToDisplay) => setQuoteOrBible(whatToDisplay);
  const toggleDisplayTime = (choice) => setDisplayTime(choice);
  const toggleDisplayWeather = (choice) => setDisplayWeather(choice);
  const toggleDisplayQuestion = (choice) => setDisplayQuestion(choice);
  const toggleDisplayCalories = (choice) => setDisplayCalories(choice);
  const toggleTwentyFourHours = (choice) => setTwentyFourHours(choice);

  // defining default display settings by storing in localstorage

  if (localStorage.getItem("showQuestion") === null) {
    localStorage.setItem("showQuestion", "true");
  }

  if (localStorage.getItem("showCalories") === null) {
    localStorage.setItem("showCalories", "true");
  }
  if (localStorage.getItem("showWeather") === null) {
    localStorage.setItem("showWeather", "true");
  }
  if (localStorage.getItem("showTime") === null) {
    localStorage.setItem("showTime", "true");
  }
  if (localStorage.getItem("showQuoteOrBible") === null) {
    localStorage.setItem("showQuoteOrBible", "quote");
  }
  if (localStorage.getItem("twentyFourHours") === null) {
    localStorage.setItem("twentyFourHours", "false");
  }

  const [quoteOrBible, setQuoteOrBible] = useState(
    localStorage.getItem("showQuoteOrBible")
  );
  const [displayTime, setDisplayTime] = useState(
    JSON.parse(localStorage.getItem("showTime"))
  );
  const [displayWeather, setDisplayWeather] = useState(
    JSON.parse(localStorage.getItem("showWeather"))
  );
  const [displayQuestion, setDisplayQuestion] = useState(
    JSON.parse(localStorage.getItem("showQuestion"))
  );
  const [displayCalories, setDisplayCalories] = useState(
    JSON.parse(localStorage.getItem("showCalories"))
  );
  const [twentyFourHours, setTwentyFourHours] = useState(
    JSON.parse(localStorage.getItem("twentyFourHours"))
  );

  return (
    <section className={styles.mainSection}>
      <Settings
        user={user && user}
        quoteOrBible={quoteOrBible}
        displayQuoteOrBible={displayQuoteOrBible}
        toggleDisplayQuestion={toggleDisplayQuestion}
        toggleDisplayCalories={toggleDisplayCalories}
        toggleDisplayWeather={toggleDisplayWeather}
        toggleDisplayTime={toggleDisplayTime}
        toggleTwentyFourHours={toggleTwentyFourHours}
        displayWeather={displayWeather}
        displayTime={displayTime}
        displayQuestion={displayQuestion}
        displayCalories={displayCalories}
        twentyFourHours={twentyFourHours}
        isLoggedIn={isLoggedIn}
        wantToSignUp={wantToSignUp}
      />
      <div className={styles.midSection}>
        {displayQuestion && (
          <DailyQuestion
            today={today}
            todayParsed={todayParsed}
            tomorrowDate={tomorrowDate}
            tomorrowDateParsed={tomorrowDateParsed}
            dailyQuestion={dailyQuestion}
            answerForDailyQuestion={answerForDailyQuestion}
            answerToDailyQuestion={answerToDailyQuestion}
          />
        )}
        <QuoteOrBible
          quoteOrBible={quoteOrBible}
          user={user && user}
          today={today}
        />
      </div>
      <div className={styles.planWeatherContainer}>
        <WeatherTime
          displayTime={displayTime}
          displayWeather={displayWeather}
          twentyFourHours={twentyFourHours}
        />
        <Plan
          dailyQuestion={dailyQuestion}
          answerForDailyQuestion={answerForDailyQuestion}
          answerToDailyQuestion={answerToDailyQuestion}
          user={user}
          yyyy={yyyy}
          mm={mm}
          dd={dd}
          today={today}
          displayQuestion={displayQuestion}
          displayCalories={displayCalories}
        />
      </div>
    </section>
  );
};

export default MainSection;
