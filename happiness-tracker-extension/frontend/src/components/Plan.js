import { useState, useEffect, useRef, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ContentEditable from "react-contenteditable";

import debounce from "lodash.debounce";
import axios from "axios";
import styles from "./Plan.module.css";
import plan from "../images/plan.svg";
// import waterGlass from '../images/water.svg';
import moon from "../images/moon.svg";
import drag from "../images/drag.svg";
// import check from '../images/check.svg';
import smallBlueTick from "../images/smallBlueTick.svg";
import smallPinkTick from "../images/smallPinkTick.svg";
import smiley1 from "../images/smiley1.svg";
import smiley10 from "../images/smiley10.svg";
import calendar from "../images/calendar.svg";

const Plan = ({
  user,
  displayQuestion,
  today,
  mm,
  dd,
  yyyy,
  dailyQuestion,
  answerForDailyQuestion,
  answerToDailyQuestion,
  displayCalories,
}) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [visible, setVisible] = useState(false);
  const [displayMonthsOrYears, setDisplayMonthsOrYears] = useState("months");
  const [currentDay, setCurrentDay] = useState(parseInt(dd));
  const [currentMonth, setCurrentMonth] = useState(
    monthNames[new Date().getMonth()]
  );
  const [currentYear, setCurrentYear] = useState(yyyy);
  const [dateState, setDateState] = useState({
    year: yyyy,
    month: monthNames[new Date().getMonth()],
    day: dd,
  });

  const [selectedTheme, setSelectedTheme] = useState({
    name: "white",
    background: "#FFFFFF",
    text: "#575757",
    borders: "0.5px solid #575757",
    darkBorder: "1px solid #000000",
    lightBorder: "0.5px solid #D0D0D0",
    darkBg: "#FCFCFC",
    waterBg: "#FCFAFF",
    waterButtons: "#000000",
    dateContainerFill: "#000000",
    dateBg: "#FFFFFF",
    dateBorder: "#FCEFEF",
    monthActiveFill: "#000000",
    monthFontColor: "#D94F9F",
    dateActiveFill: "#000000",
    dateFontColor: "#D94F9F",
    inputText: "#575757",
  });

  const colorThemes = [
    {
      name: "black",
      background: "#080808",
      text: "#FFFFFF",
      borders: "2px solid #1A1A1A",
      darkBorder: "2px solid #444444",
      lightBorder: "0.5px solid #1A1A1A",
      darkBg: "#000000",
      waterBg: "#080808",
      dateContainerFill: "#2E2E2E", //date Display
      dateBg: "#191919",
      dateBorder: "#2C2C2C",
      monthActiveFill: "#FFFFFF",
      monthFontColor: "#d94f9f",
      dateActiveFill: "#000000",
      dateFontColor: "#FFFFFF",
      inputText: "#FFFFFF",
    },
    {
      name: "white",
      background: "#FFFFFF",
      text: "#575757",
      borders: "0.5px solid #575757",
      darkBorder: "1px solid #000000",
      lightBorder: "0.5px solid #D0D0D0",
      darkBg: "#FCFCFC",
      waterBg: "#FCFAFF",
      dateContainerFill: "#000000", //date display
      dateBg: "#FFFFFF",
      dateBorder: "#FCEFEF",
      monthActiveFill: "#000000",
      monthFontColor: "#D94F9F",
      dateActiveFill: "#000000",
      dateFontColor: "#D94F9F",
      inputText: "#575757",
    },
  ];
  const [formState, setFormState] = useState({
    displayMonths: true,
    mainThreeTodo: [
      { text: "", checked: false },
      { text: "", checked: false },
      { text: "", checked: false },
    ],
    dailyToDo: [
      { text: "", checked: false },
      { text: "", checked: false },
      { text: "", checked: false },
    ],
    breakfast: [{ meal: "", calories: "" }],
    lunch: [{ meal: "", calories: "" }],
    dinner: [{ meal: "", calories: "" }],
    excitedAbout: "",
    gratefulForMorning: "",
    water: "0",
    meditation: false,
    relaxation: false,
    exercise: false,
    happyScale: "0",
    happyMoment: "",
    gratefulForTonight: "",
  });

  const userId = user._id;

  const date = `${dateState.year}-${dateState.month}-${dateState.day}`;

  const payload = {
    user: userId,
    date: new Date(date),
    excitedAbout: formState.excitedAbout,
    gratefulForMorning: formState.gratefulForMorning,
    mainThreeTodo: formState.mainThreeTodo,
    dailyToDo: formState.dailyToDo,
    meals: {
      breakfast: formState.breakfast,
      lunch: formState.lunch,
      dinner: formState.dinner,
    },
    water: parseInt(formState.water),
    exercise: formState.exercise,
    relaxation: formState.relaxation,
    meditation: formState.meditation,
    happyScale: parseInt(formState.happyScale),
    happyMoment: formState.happyMoment,
    gratefulForTonight: formState.gratefulForTonight,
    dailyQuestion: {
      question: dailyQuestion,
      answer: answerToDailyQuestion,
    },
  };

  const years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032,
  ];

  const daysInMonths = {
    Jan: 31,
    Feb:
      (0 === parseInt(dateState.year) % 4 &&
        0 !== parseInt(dateState.year) % 100) ||
      0 === parseInt(dateState.year) % 400
        ? 29
        : 28,
    Mar: 31,
    Apr: 30,
    May: 31,
    Jun: 30,
    Jul: 31,
    Aug: 31,
    Sep: 30,
    Oct: 31,
    Nov: 30,
    Dec: 31,
  };

  // const pullPlansFromStorage = () => {
  // 	const planInLocalStorage = localStorage.getItem(`plan-${date}-${userId}`);

  // 	if (planInLocalStorage === null) {
  // 		axios
  // 			.get(
  // 				`https://beatificbackendappjojojosuke.herokuapp.com/api/v1/plans/${userId}/${new Date(
  // 					date
  // 				)}`,
  // 				{
  // 					headers: { Authorization: `Bearer ${user && user.token}` },
  // 				}
  // 			)
  // 			.then((res) => {
  // 				answerForDailyQuestion(res.data.dailyQuestion?.answer ?? '');
  // 				setFormState({
  // 					displayMonths: true,
  // 					mainThreeTodo:
  // 						res.data.mainThreeTodo !== null
  // 							? [...res.data.mainThreeTodo]
  // 							: [
  // 									{ text: '', checked: false },
  // 									{ text: '', checked: false },
  // 									{ text: '', checked: false },
  // 							  ],
  // 					dailyToDo: res.data.dailyToDo
  // 						? [...res.data.dailyToDo]
  // 						: [
  // 								{ text: '', checked: false },
  // 								{ text: '', checked: false },
  // 								{ text: '', checked: false },
  // 						  ],
  // 					breakfast: res.data.meals
  // 						? [...res.data.meals?.breakfast]
  // 						: [{ meal: '', calories: '' }],
  // 					lunch: res.data.meals
  // 						? [...res.data.meals?.lunch]
  // 						: [{ meal: '', calories: '' }],
  // 					dinner: res.data.meals
  // 						? [...res.data.meals?.dinner]
  // 						: [{ meal: '', calories: '' }],
  // 					excitedAbout: res.data.excitedAbout ? res.data.excitedAbout : '',
  // 					gratefulForMorning: res.data.gratefulForMorning
  // 						? res.data.gratefulForMorning
  // 						: '',
  // 					water: res.data.water ? res.data.water.toString() : '0',
  // 					meditation: res.data.meditation ? res.data.meditation : false,
  // 					relaxation: res.data.relaxation ? res.data.relaxation : false,
  // 					exercise: res.data.exercise ? res.data.exercise : false,
  // 					happyScale: res.data.happyScale
  // 						? res.data.happyScale.toString()
  // 						: '0',
  // 					happyMoment: res.data.happyMoment ? res.data.happyMoment : '',
  // 					gratefulForTonight: res.data.gratefulForTonight
  // 						? res.data.gratefulForTonight
  // 						: '',
  // 				});
  // 			})
  // 			.catch((err) => {
  // 				console.log(`THIS IS THE ERROR FROM THE SERVER ${err}`);
  // 			});

  // 		localStorage.removeItem(`plan-${date}-${userId}`);
  // 		localStorage.setItem(`plan-${date}-${userId}`, JSON.stringify(payload));
  // 	} else {
  // 		const JSONifiedPlan = JSON.parse(
  // 			localStorage.getItem(`plan-${date}-${userId}`)
  // 		);

  // 		answerForDailyQuestion(JSONifiedPlan.dailyQuestion.answer ?? '');
  // 		// try {
  // 		setFormState({
  // 			displayMonths: true,
  // 			mainThreeTodo:
  // 				JSONifiedPlan.mainThreeTodo !== null
  // 					? [...JSONifiedPlan.mainThreeTodo]
  // 					: [
  // 							{ text: '', checked: false },
  // 							{ text: '', checked: false },
  // 							{ text: '', checked: false },
  // 					  ],
  // 			dailyToDo: JSONifiedPlan.dailyToDo
  // 				? [...JSONifiedPlan.dailyToDo]
  // 				: [
  // 						{ text: '', checked: false },
  // 						{ text: '', checked: false },
  // 						{ text: '', checked: false },
  // 				  ],
  // 			breakfast: JSONifiedPlan.meals
  // 				? [...JSONifiedPlan.meals?.breakfast]
  // 				: [{ meal: '', calories: '' }],
  // 			lunch: JSONifiedPlan.meals
  // 				? [...JSONifiedPlan.meals?.lunch]
  // 				: [{ meal: '', calories: '' }],
  // 			dinner: JSONifiedPlan.meals
  // 				? [...JSONifiedPlan.meals?.dinner]
  // 				: [{ meal: '', calories: '' }],
  // 			excitedAbout: JSONifiedPlan.excitedAbout
  // 				? JSONifiedPlan.excitedAbout
  // 				: '',
  // 			gratefulForMorning: JSONifiedPlan.gratefulForMorning
  // 				? JSONifiedPlan.gratefulForMorning
  // 				: '',
  // 			water: JSONifiedPlan.water ? JSONifiedPlan.water.toString() : '0',
  // 			meditation: JSONifiedPlan.meditation ? JSONifiedPlan.meditation : false,
  // 			relaxation: JSONifiedPlan.relaxation ? JSONifiedPlan.relaxation : false,
  // 			exercise: JSONifiedPlan.exercise ? JSONifiedPlan.exercise : false,
  // 			happyScale: JSONifiedPlan.happyScale
  // 				? JSONifiedPlan.happyScale.toString()
  // 				: '0',
  // 			happyMoment: JSONifiedPlan.happyMoment ? JSONifiedPlan.happyMoment : '',
  // 			gratefulForTonight: JSONifiedPlan.gratefulForTonight
  // 				? JSONifiedPlan.gratefulForTonight
  // 				: '',
  // 		});
  // 		// } catch (err) {
  // 		// 	console.log(err);
  // 		// } REMOVED TRY_CATCH TO SEE IF THIS IS THE ISSUE
  // 	}
  // };

  const dayString = new Date(
    `${
      dateState.month
    }/${dateState.day.toString()}/${dateState.year.toString()}`
  ).toLocaleDateString("en-US", { weekday: "short" });

  const [opened, setOpened] = useState(false);
  const [animation, setAnimation] = useState(styles.scaleIn);
  const togglePlan = () => {
    if (visible) {
      setOpened(true);
      setAnimation(styles.scaleOut);
      setTimeout(() => {
        setVisible(false);
      }, 200);
      return;
    }
    setAnimation(styles.scaleIn);
    setVisible(true);
  };

  useEffect(() => {
    const planInLocalStorage = localStorage.getItem(`plan-${date}-${userId}`);
    const themeInLocalStorage = localStorage.getItem("currentTheme");
    if (themeInLocalStorage) setSelectedTheme(JSON.parse(themeInLocalStorage));

    if (planInLocalStorage === null) {
      console.log("downstream", new Date(date).toISOString());
      axios
        .get(
          `http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/plans/${userId}/${new Date(
            date
          ).toISOString()}`,
          {
            headers: { Authorization: `Bearer ${user && user.token}` },
          }
        )
        .then((res) => {
          console.log(res);
          answerForDailyQuestion(res.data.dailyQuestion?.answer ?? "");
          setFormState({
            displayMonths: true,
            mainThreeTodo:
              res.data.mainThreeTodo !== null
                ? [...res.data.mainThreeTodo]
                : [
                    { text: "", checked: false },
                    { text: "", checked: false },
                    { text: "", checked: false },
                  ],
            dailyToDo: res.data.dailyToDo
              ? [...res.data.dailyToDo]
              : [
                  { text: "", checked: false },
                  { text: "", checked: false },
                  { text: "", checked: false },
                ],
            breakfast: res.data.meals
              ? [...res.data.meals?.breakfast]
              : [{ meal: "", calories: "" }],
            lunch: res.data.meals
              ? [...res.data.meals?.lunch]
              : [{ meal: "", calories: "" }],
            dinner: res.data.meals
              ? [...res.data.meals?.dinner]
              : [{ meal: "", calories: "" }],
            excitedAbout: res.data.excitedAbout ? res.data.excitedAbout : "",
            gratefulForMorning: res.data.gratefulForMorning
              ? res.data.gratefulForMorning
              : "",
            water: res.data.water ? res.data.water.toString() : "0",
            meditation: res.data.meditation ? res.data.meditation : false,
            relaxation: res.data.relaxation ? res.data.relaxation : false,
            exercise: res.data.exercise ? res.data.exercise : false,
            happyScale: res.data.happyScale
              ? res.data.happyScale.toString()
              : "0",
            happyMoment: res.data.happyMoment ? res.data.happyMoment : "",
            gratefulForTonight: res.data.gratefulForTonight
              ? res.data.gratefulForTonight
              : "",
          });
        })
        .catch((err) => {});

      localStorage.removeItem(`plan-${date}-${userId}`);
      localStorage.setItem(`plan-${date}-${userId}`, JSON.stringify(payload));
    } else {
      const JSONifiedPlan = JSON.parse(
        localStorage.getItem(`plan-${date}-${userId}`)
      );

      answerForDailyQuestion(JSONifiedPlan.dailyQuestion.answer);

      setFormState({
        displayMonths: true,
        mainThreeTodo:
          JSONifiedPlan.mainThreeTodo !== null
            ? [...JSONifiedPlan.mainThreeTodo]
            : [
                { text: "", checked: false },
                { text: "", checked: false },
                { text: "", checked: false },
              ],
        dailyToDo: JSONifiedPlan.dailyToDo
          ? [...JSONifiedPlan.dailyToDo]
          : [
              { text: "", checked: false },
              { text: "", checked: false },
              { text: "", checked: false },
            ],
        breakfast: JSONifiedPlan.meals
          ? [...JSONifiedPlan.meals?.breakfast]
          : [{ meal: "", calories: "" }],
        lunch: JSONifiedPlan.meals
          ? [...JSONifiedPlan.meals?.lunch]
          : [{ meal: "", calories: "" }],
        dinner: JSONifiedPlan.meals
          ? [...JSONifiedPlan.meals?.dinner]
          : [{ meal: "", calories: "" }],
        excitedAbout: JSONifiedPlan.excitedAbout
          ? JSONifiedPlan.excitedAbout
          : "",
        gratefulForMorning: JSONifiedPlan.gratefulForMorning
          ? JSONifiedPlan.gratefulForMorning
          : "",
        water: JSONifiedPlan.water ? JSONifiedPlan.water.toString() : "0",
        meditation: JSONifiedPlan.meditation ? JSONifiedPlan.meditation : false,
        relaxation: JSONifiedPlan.relaxation ? JSONifiedPlan.relaxation : false,
        exercise: JSONifiedPlan.exercise ? JSONifiedPlan.exercise : false,
        happyScale: JSONifiedPlan.happyScale
          ? JSONifiedPlan.happyScale.toString()
          : "0",
        happyMoment: JSONifiedPlan.happyMoment ? JSONifiedPlan.happyMoment : "",
        gratefulForTonight: JSONifiedPlan.gratefulForTonight
          ? JSONifiedPlan.gratefulForTonight
          : "",
      });
    }

    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].height = "inherit";
      tx[i].setAttribute(
        "style",
        "height:" +
          22 +
          `px;overflow-y:hidden;background:${selectedTheme.background};border-bottom:${selectedTheme.borders}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, userId, today, user]);

  useEffect(() => {
    localStorage.setItem("currentTheme", JSON.stringify(selectedTheme));
  }, [selectedTheme]);
  //sync plan
  const [saving, setSaving] = useState(false);

  const syncPlan = (pyld, dt) =>
    new Promise((resolve) => {
      if (saving) return;

      console.log("syncing");

      setSaving(true);
      console.log(pyld, dt);
      console.log("upstream", new Date(dt).toISOString());
      axios
        .put(
          `http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/plans/${userId}/${new Date(
            dt
          ).toISOString()}`,
          pyld,
          {
            headers: { Authorization: `Bearer ${user && user.token}` },
          }
        )
        .then((res) => {
          resolve(res);
          console.log("Successfully saved");
          setSaving(false);
        })
        .catch((err) => {
          console.log(err);
        });
    });

  useEffect(() => {
    if (!opened) return;
    if (visible) return;
    let timer = setTimeout(() => {
      syncPlan(payload, date);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [visible]);

  const storePlanInDb = useCallback(() => {
    // console.log(payload);
    if (localStorage.getItem(`plan-${date}-${userId}`)) {
      localStorage.removeItem(`plan-${date}-${userId}`);
    }
    localStorage.setItem(`plan-${date}-${userId}`, JSON.stringify(payload));
    // eslint-disable-next-line no-undef
    // chrome.runtime.sendMessage(
    //   {
    //     command: "savePlanner",
    //     data: { payload: payload, date: date, userId, user },
    //   },
    //   (res) => res
    // );
  }, [payload, date, userId, user]);

  const handleFormChange = (e) => {
    const name = e.target.name;
    let value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value.replaceAll("<br>", "\n");

    setFormState({
      ...formState,
      [name]: value,
    });
    // this is bad behavior but it works. But still it's bad behavior.
    // storePlanInDb();
    // debounced();
  };

  useEffect(() => {
    storePlanInDb();
    console.log(formState);
  }, [formState]);

  const clearState = () => {
    answerForDailyQuestion("");
    setFormState({
      displayMonths: true,
      mainThreeTodo: [
        { text: "", checked: false },
        { text: "", checked: false },
        { text: "", checked: false },
      ],
      dailyToDo: [
        { text: "", checked: false },
        { text: "", checked: false },
        { text: "", checked: false },
      ],
      breakfast: [{ meal: "", calories: "" }],
      lunch: [{ meal: "", calories: "" }],
      dinner: [{ meal: "", calories: "" }],
      excitedAbout: "",
      gratefulForMorning: "",
      water: "0",
      meditation: false,
      relaxation: false,
      exercise: false,
      happyScale: "0",
      happyMoment: "",
      gratefulForTonight: "",
      dailyQuestion: { question: "", answer: "" },
    });
  };

  // useEffect(() => {
  // 	const interval = setInterval(() => {
  // 		if (visible) {
  // 			storePlanInDb();
  // 		}
  // 	}, 6000);

  // 	return () => clearInterval(interval);
  // 	// eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [visible]);

  // useEffect(() => {
  // 	document.addEventListener('visibilitychange', function () {
  // 		if (document.visibilityState === 'hidden') {
  // 			storePlanInDb();
  // 			alert('Saving!');
  // 		}
  // 	});

  // document.addEventListener('beforeunload', function () {
  // 	storePlanInDb();
  // 	alert('Saving!');
  // })

  // 	return () => {
  // 		document.removeEventListener('visibilitychange', function () {
  // 			if (document.visibilityState === 'hidden') {
  // 				storePlanInDb();
  // 				alert('Saving!');
  // 			}
  // 		});

  // 		document.removeEventListener('beforeunload', function () {
  // 			storePlanInDb();
  // 			alert('Saving!');
  // 		}
  // 	};
  // 	// eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  // 	const onBeforeUnload = () => {
  // 		storePlanInDb();
  // 	};
  // 	window.addEventListener('beforeunload', onBeforeUnload);

  // 	return () => {
  // 		window.removeEventListener('beforeunload', onBeforeUnload);
  // 	};
  // }, []);

  const wiggleWiggle = useRef(null);
  const [wiggling, setWiggling] = useState(false);

  useEffect(() => {
    if (!wiggleWiggle.current) return;
    setWiggling(true);
    setTimeout(() => {
      setWiggling(false);
    }, 600);
  }, [formState.water]);

  useEffect(() => {
    console.log(currentDay, currentMonth, currentYear);
  });

  const planPopup = useRef(null);

  useEffect(() => {
    const closeIfOutside = (e) => {
      if (!visible) return;
      if (!planPopup.current) return;
      if (planPopup.current.contains(e.target)) return;
      if (e.target.classList.contains("plan-icon")) return;
      if (e.target.classList.contains("planToggleImg")) return;

      togglePlan();
    };

    window.addEventListener("click", closeIfOutside);
    return () => {
      window.removeEventListener("click", closeIfOutside);
    };
  }, [togglePlan, visible]);

  return (
    <div>
      {visible && (
        <div
          className={`${styles.planContainer} ${animation}`}
          style={{
            background: selectedTheme.background,
            color: selectedTheme.text,
          }}
          ref={planPopup}
        >
          <form className={styles.planner}>
            <div className={styles.topSection}>
              <div
                className={styles.dateDisplay}
                style={{ background: selectedTheme.dateContainerFill }}
              >
                <div className={styles.gradientDot}></div>
                <p className={styles.dateArticle}>
                  {dayString.toUpperCase()} {dateState.day} {dateState.year}
                </p>
              </div>
              <div className={styles.colorChooser}>
                {colorThemes.map((ct) => (
                  <button
                    className={styles.colorButton}
                    style={{
                      background: ct.background,
                      border: `1px solid rgb(123 123 123)`,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedTheme({ ...ct });
                    }}
                  ></button>
                ))}
              </div>
            </div>
            <hr
              className={styles.underDate}
              style={{ borderColor: selectedTheme.dateBorder }}
            />
            <div className={styles.gratefulForAndOther}>
              <div
                className={styles.excitedAboutToday}
                style={{ border: `${selectedTheme.borders}` }}
              >
                <label
                  htmlFor="excitedAboutToday"
                  style={{ color: selectedTheme.text }}
                >
                  TODAY I'M EXCITED ABOUT
                </label>
                <ContentEditable
                  id="excitedAboutToday"
                  className={styles.excitedAboutInput}
                  html={formState.excitedAbout.replaceAll("\n", "<br>")}
                  disabled={false}
                  onChange={(e) => {
                    e.target.name = "excitedAbout";
                    handleFormChange(e);
                  }}
                  style={{
                    borderBottom: selectedTheme.borders,
                    color: selectedTheme.inputText,
                  }}
                />
              </div>
              <div className={styles.gratefulFor}>
                <label
                  htmlFor="gratefulFor"
                  style={{ color: selectedTheme.text }}
                >
                  I'M GRATEFUL FOR
                </label>
                <ContentEditable
                  id="gratefulFor"
                  className={styles.gratefulForInput}
                  html={formState.gratefulForMorning.replaceAll("\n", "<br>")}
                  disabled={false}
                  onChange={(e) => {
                    e.target.name = "gratefulForMorning";
                    handleFormChange(e);
                  }}
                  style={{
                    borderBottom: selectedTheme.borders,
                    color: selectedTheme.inputText,
                  }}
                />
              </div>
            </div>
            <div
              className={styles.mainThreeTodo}
              style={{ border: `${selectedTheme.darkBorder}` }}
            >
              <DragDropContext
                onDragEnd={(param) => {
                  if (!param.destination) {
                    return;
                  }
                  const tx = document.getElementsByTagName("textarea");
                  for (let i = 0; i < tx.length; i++) {
                    tx[i].height = "22px";
                    tx[i].setAttribute(
                      "style",
                      "height:" + 22 + "px;overflow-y:hidden;"
                    );
                  }
                  const srcIdx = param.source.index;
                  const destIdx = param.destination.index;
                  const list = [...formState.mainThreeTodo];
                  const [removed] = list.splice(srcIdx, 1);
                  list.splice(destIdx, 0, removed);
                  setFormState({ ...formState, mainThreeTodo: [...list] });
                }}
              >
                <label style={{ color: selectedTheme.text }}>
                  MAIN THREE TODO
                </label>
                <Droppable droppableId="droppable-1">
                  {(provided, _) => (
                    <div
                      className={styles.listSection}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {formState.mainThreeTodo.map((_, idx) => {
                        return (
                          <Draggable
                            key={idx}
                            draggableId={"draggable-" + idx}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`${styles.listItem} ${
                                  selectedTheme.name === "black"
                                    ? styles.dark
                                    : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  name="mainThreeCheck"
                                  id="mainThreeCheck"
                                  checked={formState.mainThreeTodo[idx].checked}
                                  onChange={(e) => {
                                    const list = [...formState.mainThreeTodo];
                                    list[idx]["checked"] = !list[idx].checked;
                                    if (list[idx].checked) {
                                      document.getElementById(
                                        `mainThreeTodoItem${idx}`
                                      ).style.textDecoration = "line-through";
                                      document.getElementById(
                                        `mainThreeTodoItem${idx}`
                                      ).style.color = "#4e1f77";
                                    }
                                    setFormState({
                                      ...formState,
                                      mainThreeTodo: list,
                                    });
                                  }}
                                  className={
                                    selectedTheme.name === "black"
                                      ? !formState.mainThreeTodo[idx].checked &&
                                        styles.darkCheckbox
                                      : ""
                                  }
                                />
                                <textarea
                                  rows={1}
                                  name="mainThreeTodoItem"
                                  id={`mainThreeTodoItem${idx}`}
                                  onKeyDown={(e) => {
                                    e.target.style.height = "22px";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                    e.target.style.borderBottom =
                                      selectedTheme.borders;
                                    e.target.style.backgroundColor =
                                      selectedTheme.background;

                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      if (
                                        formState.mainThreeTodo.length - 1 >
                                        idx
                                      ) {
                                        document
                                          .getElementById(
                                            `mainThreeTodoItem${idx + 1}`
                                          )
                                          .focus();
                                      }
                                    } else if (
                                      formState.mainThreeTodo.length - 1 <=
                                      idx
                                    ) {
                                      const list = formState.mainThreeTodo;
                                      list.push({ text: "", checked: false });
                                      setFormState({
                                        ...formState,
                                        mainThreeTodo: list,
                                      });
                                    }
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.height = "22px";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                  }}
                                  value={formState.mainThreeTodo[idx].text}
                                  onChange={(e) => {
                                    const list = [...formState.mainThreeTodo];
                                    list[idx]["text"] = e.target.value;
                                    setFormState({
                                      ...formState,
                                      mainThreeTodo: list,
                                    });
                                  }}
                                  className={
                                    formState.mainThreeTodo[idx].checked
                                      ? `${styles.todoDone} ${styles.todoInput}`
                                      : selectedTheme.name === "black"
                                      ? `${styles.todoDark} ${styles.todoInput}`
                                      : styles.todoInput
                                  }
                                  style={{
                                    backgroundColor: selectedTheme.background,
                                    borderBottom: selectedTheme.borders,
                                  }}
                                ></textarea>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const list = [...formState.mainThreeTodo];
                                    if (list.length > 1) {
                                      list.splice(idx, 1);
                                    } else {
                                      formState.mainThreeTodo[idx].text = "";
                                      formState.mainThreeTodo[
                                        idx
                                      ].checked = false;
                                      e.target.disabled = true;
                                    }
                                    setFormState({
                                      ...formState,
                                      mainThreeTodo: list,
                                    });
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                                <img
                                  {...provided.dragHandleProps}
                                  src={drag}
                                  alt="drag icon"
                                  className={styles.draggable}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      <button
                        className={styles.addTaskBtn}
                        onClick={(e) => {
                          e.preventDefault();
                          const list = formState.mainThreeTodo;
                          list.push({ text: "", checked: false });
                          setFormState({ ...formState, mainThreeTodo: list });

                          const newIndex = formState.mainThreeTodo.length;
                          document
                            .getElementById(`mainThreeTodoItem${newIndex - 1}`)
                            .focus();
                        }}
                        style={{
                          marginTop: "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>{" "}
                        <span>Add task</span>
                      </button>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            <div
              className={styles.dailyToDo}
              style={{
                border: selectedTheme.lightBorder,
              }}
            >
              <DragDropContext
                onDragEnd={(param) => {
                  if (!param.destination) {
                    return;
                  }
                  const tx = document.getElementsByTagName("textarea");
                  for (let i = 0; i < tx.length; i++) {
                    tx[i].height = "22px";
                    tx[i].setAttribute("style", "height:" + 22 + "px;");
                  }
                  const srcIdx = param.source.index;
                  const destIdx = param.destination.index;
                  const list = [...formState.dailyToDo];
                  const [removed] = list.splice(srcIdx, 1);
                  list.splice(destIdx, 0, removed);
                  setFormState({ ...formState, dailyToDo: [...list] });
                }}
              >
                <label>DAILY TODO</label>
                <Droppable droppableId="droppable-2">
                  {(provided, _) => (
                    <div
                      className={styles.listSection}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {formState.dailyToDo.map((_, idx) => {
                        return (
                          <Draggable
                            key={idx}
                            draggableId={"draggable-" + idx}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                className={styles.listItem}
                                {...provided.draggableProps}
                              >
                                <input
                                  type="checkbox"
                                  name="dailyToDoCheck"
                                  id="dailyToDoCheck"
                                  checked={formState.dailyToDo[idx].checked}
                                  onChange={(e) => {
                                    const list = [...formState.dailyToDo];
                                    list[idx]["checked"] = !list[idx].checked;
                                    setFormState({
                                      ...formState,
                                      dailyToDo: list,
                                    });
                                  }}
                                  className={
                                    selectedTheme.name === "black"
                                      ? !formState.dailyToDo[idx].checked &&
                                        styles.darkCheckbox
                                      : ""
                                  }
                                />
                                <textarea
                                  rows={1}
                                  name="dailyToDoItem"
                                  id={`dailyToDoItem${idx}`}
                                  onKeyDown={(e) => {
                                    e.target.style.height = "22px";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                    e.target.style.borderBottom =
                                      selectedTheme.borders;

                                    if (e.code === "Enter") {
                                      e.preventDefault();
                                      if (
                                        formState.dailyToDo.length - 1 >
                                        idx
                                      ) {
                                        document
                                          .getElementById(
                                            `dailyToDoItem${idx + 1}`
                                          )
                                          .focus();
                                      }
                                    } else if (
                                      formState.dailyToDo.length - 1 <=
                                      idx
                                    ) {
                                      const list = formState.dailyToDo;
                                      list.push({ text: "", checked: false });
                                      setFormState({
                                        ...formState,
                                        dailyToDo: list,
                                      });
                                    }
                                  }}
                                  value={formState.dailyToDo[idx].text}
                                  onChange={(e) => {
                                    const list = [...formState.dailyToDo];
                                    list[idx]["text"] = e.target.value;
                                    setFormState({
                                      ...formState,
                                      dailyToDo: list,
                                    });
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.height = "22px";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                  }}
                                  style={{
                                    background: selectedTheme.background,
                                    borderBottom: selectedTheme.borders,
                                    textDecoration: formState.dailyToDo[idx]
                                      .checked
                                      ? "line-through"
                                      : "",
                                    color: formState.dailyToDo[idx].checked
                                      ? "#C1C1C1"
                                      : "#4e1f77",
                                  }}
                                  className={
                                    formState.dailyToDo[idx].checked
                                      ? `${styles.todoDone} ${styles.todoInput}`
                                      : selectedTheme.name === "black"
                                      ? `${styles.todoDark} ${styles.todoInput}`
                                      : styles.todoInput
                                  }
                                ></textarea>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const list = [...formState.dailyToDo];
                                    if (list.length > 1) {
                                      list.splice(idx, 1);
                                    } else {
                                      formState.dailyToDo[idx].text = "";
                                      formState.dailyToDo[idx].checked = false;
                                      e.target.disabled = true;
                                    }
                                    setFormState({
                                      ...formState,
                                      dailyToDo: list,
                                    });

                                    document
                                      .getElementById(
                                        `dailyToDoItem${
                                          formState.dailyToDo.length - 1
                                        }`
                                      )
                                      .focus();
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                                <img
                                  {...provided.dragHandleProps}
                                  src={drag}
                                  alt="drag icon"
                                  className={styles.draggable}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      <button
                        className={styles.addTaskBtn}
                        onClick={(e) => {
                          e.preventDefault();
                          const list = formState.dailyToDo;
                          list.push({ text: "", checked: false });
                          setFormState({ ...formState, dailyToDo: list });
                        }}
                        style={{
                          marginTop: "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>{" "}
                        <span>Add task</span>
                      </button>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            <div className={styles.meals}>
              <div className={styles.meal}>
                <label
                  className={styles.breakfastLabel}
                  style={{ color: selectedTheme.text }}
                >
                  BREAKFAST
                </label>
                {formState.breakfast.map((_, idx) => {
                  return (
                    <div key={idx} className={styles.mealInput}>
                      <input
                        type="text"
                        name="breakfastMeal"
                        id="breakfastMeal"
                        style={{
                          background: selectedTheme.background,
                          borderBottom: selectedTheme.borders,
                          color: selectedTheme.inputText,
                        }}
                        value={formState.breakfast[idx].meal}
                        onChange={(e) => {
                          const list = [...formState.breakfast];
                          list[idx].meal = e.target.value;
                          setFormState({ ...formState, breakfast: list });
                        }}
                        className={styles.mealText}
                      />
                      {displayCalories && (
                        <div className={styles.mealDot}></div>
                      )}
                      {displayCalories && (
                        <input
                          type="text"
                          name="breakfastCalories"
                          id="breakfastCalories"
                          value={formState.breakfast[idx].calories}
                          placeholder="cal"
                          onChange={(e) => {
                            const list = [...formState.breakfast];
                            list[idx].calories = e.target.value;
                            setFormState({ ...formState, breakfast: list });
                          }}
                          style={{
                            background: selectedTheme.background,
                            borderBottom: selectedTheme.borders,
                            color: selectedTheme.inputText,
                          }}
                          className={styles.caloriesText}
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const list = [...formState.breakfast];
                          if (list.length > 1) {
                            list.splice(idx, 1);
                          } else {
                            formState.breakfast[idx].meal = "";
                            formState.breakfast[idx].calories = "";
                            e.target.disabled = true;
                          }
                          setFormState({ ...formState, breakfast: list });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const list = formState.breakfast;
                    list.push({ meal: "", calories: "" });
                    setFormState({ ...formState, breakfast: list });
                  }}
                  style={{ marginTop: "14px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
              <div className={styles.meal}>
                <label style={{ color: selectedTheme.text }}>LUNCH</label>
                {formState.lunch.map((_, idx) => {
                  return (
                    <div key={idx} className={styles.mealInput}>
                      <input
                        type="text"
                        name="dinner"
                        id="dinner"
                        style={{
                          background: selectedTheme.background,
                          borderBottom: selectedTheme.borders,
                          color: selectedTheme.inputText,
                        }}
                        value={formState.lunch[idx].meal}
                        onChange={(e) => {
                          const list = [...formState.lunch];
                          list[idx].meal = e.target.value;
                          setFormState({ ...formState, lunch: list });
                        }}
                        className={styles.mealText}
                      />
                      {displayCalories && (
                        <div className={styles.mealDot}></div>
                      )}
                      {displayCalories && (
                        <input
                          type="text"
                          name="lunchCalories"
                          id="lunchCalories"
                          placeholder="cal"
                          value={formState.lunch[idx].calories}
                          onChange={(e) => {
                            const list = [...formState.lunch];
                            list[idx].calories = e.target.value;
                            setFormState({ ...formState, lunch: list });
                          }}
                          style={{
                            background: selectedTheme.background,
                            borderBottom: selectedTheme.borders,
                            color: selectedTheme.inputText,
                          }}
                          className={styles.caloriesText}
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const list = [...formState.lunch];
                          if (list.length > 1) {
                            list.splice(idx, 1);
                          } else {
                            formState.lunch[idx].meal = "";
                            formState.lunch[idx].calories = "";
                            e.target.disabled = true;
                          }
                          setFormState({ ...formState, lunch: list });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const list = formState.lunch;
                    list.push({ meal: "", calories: "" });
                    setFormState({ ...formState, lunch: list });
                  }}
                  style={{ marginTop: "14px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
              <div className={styles.meal}>
                <label style={{ color: selectedTheme.text }}>DINNER</label>
                {formState.dinner.map((_, idx) => {
                  return (
                    <div key={idx} className={styles.mealInput}>
                      <input
                        type="text"
                        name="dinnerMeal"
                        id="dinnerMeal"
                        style={{
                          background: selectedTheme.background,
                          borderBottom: selectedTheme.borders,
                          color: selectedTheme.inputText,
                        }}
                        value={formState.dinner[idx].meal}
                        onChange={(e) => {
                          const list = [...formState.dinner];
                          list[idx].meal = e.target.value;
                          setFormState({ ...formState, dinner: list });
                        }}
                        className={styles.mealText}
                      />
                      {displayCalories && (
                        <div className={styles.mealDot}></div>
                      )}
                      {displayCalories && (
                        <input
                          type="text"
                          name="dinnerCalories"
                          id="dinnerCalories"
                          placeholder="cal"
                          value={formState.dinner[idx].calories}
                          onChange={(e) => {
                            const list = [...formState.dinner];
                            list[idx].calories = e.target.value;
                            setFormState({ ...formState, dinner: list });
                          }}
                          style={{
                            background: selectedTheme.background,
                            borderBottom: selectedTheme.borders,
                            color: selectedTheme.inputText,
                          }}
                          className={styles.caloriesText}
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const list = [...formState.dinner];
                          if (list.length > 1) {
                            list.splice(idx, 1);
                          } else {
                            formState.dinner[idx].meal = "";
                            formState.dinner[idx].calories = "";
                            e.target.disabled = true;
                          }
                          setFormState({ ...formState, dinner: list });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const list = formState.dinner;
                    list.push({ meal: "", calories: "" });
                    setFormState({ ...formState, dinner: list });
                  }}
                  style={{ marginTop: "14px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div
              className={styles.water}
              style={{
                background: selectedTheme.waterBg,
                borderColor: selectedTheme.dateBorder,
              }}
            >
              <label style={{ color: selectedTheme.text }}>WATER</label>
              <div className={styles.waterChecks}>
                <svg
                  className={wiggling ? styles.wiggling : ""}
                  width="30"
                  height="31"
                  viewBox="0 0 30 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  ref={wiggleWiggle}
                >
                  <path
                    d="M15 30.3281C23.2843 30.3281 30 23.6124 30 15.3281C30 7.04383 23.2843 0.328102 15 0.328102C6.71573 0.328102 0 7.04383 0 15.3281C0 23.6124 6.71573 30.3281 15 30.3281Z"
                    fill="#F4F7FF"
                  />
                  <path
                    d="M10.0832 8.5H19.9168C20.2087 8.5 20.4385 8.74894 20.4152 9.03987L19.3752 22.0399C19.3544 22.2997 19.1375 22.5 18.8768 22.5H11.1232C10.8625 22.5 10.6456 22.2997 10.6248 22.0399L9.58479 9.03987C9.56151 8.74894 9.79133 8.5 10.0832 8.5Z"
                    fill="url(#paint0_linear_402_2)"
                    stroke="#0044FF"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_402_2"
                      x1="15"
                      y1="8"
                      x2="15"
                      y2={`${26 - parseInt(formState.water) * 2} `}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop
                        offset="0.776042"
                        stopColor="#0044FF"
                        stopOpacity="0"
                      />
                      <stop offset="0.776142" stopColor="#0044FF" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* <img src={waterGlass} alt="icon of glass of water" /> */}
                <hr
                  className={styles.betweenChecks}
                  style={{ border: selectedTheme.lightBorder }}
                />

                <input
                  type="radio"
                  name="water"
                  id="water8"
                  value="8"
                  checked={formState.water === "8"}
                  onChange={handleFormChange}
                />
                <div className={styles.labelArea}>
                  <img
                    style={{
                      visibility:
                        formState.water === "8" ? "visible" : "hidden",
                    }}
                    src={smallBlueTick}
                    alt="small blue tick"
                  />
                  <label
                    style={{
                      boxShadow: formState.water === "8" ? "none" : "",
                      color:
                        formState.water === "8" ? "white" : selectedTheme.text,
                      backgroundColor:
                        formState.water >= "8"
                          ? "#93b0ff"
                          : selectedTheme.background,
                      border: selectedTheme.lightBorder,
                    }}
                    htmlFor="water8"
                  >
                    8
                  </label>
                </div>

                <hr
                  className={styles.betweenChecks}
                  style={{ border: selectedTheme.lightBorder }}
                />

                <input
                  type="radio"
                  name="water"
                  id="water7"
                  value="7"
                  checked={formState.water === "7"}
                  onChange={handleFormChange}
                />
                <div className={styles.labelArea}>
                  <img
                    style={{
                      visibility:
                        formState.water === "7" ? "visible" : "hidden",
                    }}
                    src={smallBlueTick}
                    alt="small blue tick"
                  />
                  <label
                    style={{
                      boxShadow: formState.water === "7" ? "none" : "",
                      color:
                        formState.water === "7" ? "white" : selectedTheme.text,
                      backgroundColor:
                        formState.water >= "7"
                          ? "#93b0ff"
                          : selectedTheme.background,
                      border: selectedTheme.lightBorder,
                    }}
                    htmlFor="water7"
                  >
                    7
                  </label>
                </div>

                <hr
                  className={styles.betweenChecks}
                  style={{ border: selectedTheme.lightBorder }}
                />

                <input
                  type="radio"
                  name="water"
                  id="water6"
                  value="6"
                  checked={formState.water === "6"}
                  onChange={handleFormChange}
                />
                <div className={styles.labelArea}>
                  <img
                    style={{
                      visibility:
                        formState.water === "6" ? "visible" : "hidden",
                    }}
                    src={smallBlueTick}
                    alt="small blue tick"
                  />
                  <label
                    style={{
                      boxShadow: formState.water === "6" ? "none" : "",
                      color:
                        formState.water === "6" ? "white" : selectedTheme.text,
                      backgroundColor:
                        formState.water >= "6"
                          ? "#93b0ff"
                          : selectedTheme.background,
                      border: selectedTheme.lightBorder,
                    }}
                    htmlFor="water6"
                  >
                    6
                  </label>
                </div>

                <hr
                  className={styles.betweenChecks}
                  style={{ border: selectedTheme.lightBorder }}
                />

                <input
                  type="radio"
                  name="water"
                  id="water5"
                  value="5"
                  checked={formState.water === "5"}
                  onChange={handleFormChange}
                />
                <div className={styles.labelArea}>
                  <img
                    style={{
                      visibility:
                        formState.water === "5" ? "visible" : "hidden",
                    }}
                    src={smallBlueTick}
                    alt="small blue tick"
                  />
                  <label
                    style={{
                      boxShadow: formState.water === "5" ? "none" : "",
                      color:
                        formState.water === "5" ? "white" : selectedTheme.text,
                      backgroundColor:
                        formState.water >= "5"
                          ? "#93b0ff"
                          : selectedTheme.background,
                      border: selectedTheme.lightBorder,
                    }}
                    htmlFor="water5"
                  >
                    5
                  </label>
                </div>

                <hr
                  className={styles.betweenChecks}
                  style={{ border: selectedTheme.lightBorder }}
                />

                <input
                  type="radio"
                  name="water"
                  id="water4"
                  value="4"
                  checked={formState.water === "4"}
                  onChange={handleFormChange}
                />
                <div className={styles.labelArea}>
                  <img
                    style={{
                      visibility:
                        formState.water === "4" ? "visible" : "hidden",
                    }}
                    src={smallBlueTick}
                    alt="small blue tick"
                  />
                  <label
                    style={{
                      boxShadow: formState.water === "4" ? "none" : "",
                      color:
                        formState.water === "4" ? "white" : selectedTheme.text,
                      backgroundColor:
                        formState.water >= "4"
                          ? "#93b0ff"
                          : selectedTheme.background,
                      border: selectedTheme.lightBorder,
                    }}
                    htmlFor="water4"
                  >
                    4
                  </label>
                </div>

                <hr
                  className={styles.betweenChecks}
                  style={{ border: selectedTheme.lightBorder }}
                />

                <input
                  type="radio"
                  name="water"
                  id="water3"
                  value="3"
                  checked={formState.water === "3"}
                  onChange={handleFormChange}
                />
                <div className={styles.labelArea}>
                  <img
                    style={{
                      visibility:
                        formState.water === "3" ? "visible" : "hidden",
                    }}
                    src={smallBlueTick}
                    alt="small blue tick"
                  />
                  <label
                    style={{
                      boxShadow: formState.water === "3" ? "none" : "",
                      color:
                        formState.water === "3" ? "white" : selectedTheme.text,
                      backgroundColor:
                        formState.water >= "3"
                          ? "#93b0ff"
                          : selectedTheme.background,
                      border: selectedTheme.lightBorder,
                    }}
                    htmlFor="water3"
                  >
                    3
                  </label>
                </div>

                <hr
                  className={styles.betweenChecks}
                  style={{ border: selectedTheme.lightBorder }}
                />

                <input
                  type="radio"
                  name="water"
                  id="water2"
                  value="2"
                  checked={formState.water === "2"}
                  onChange={handleFormChange}
                />
                <div className={styles.labelArea}>
                  <img
                    style={{
                      visibility:
                        formState.water === "2" ? "visible" : "hidden",
                    }}
                    src={smallBlueTick}
                    alt="small blue tick"
                  />
                  <label
                    style={{
                      boxShadow: formState.water === "2" ? "none" : "",
                      color:
                        formState.water === "2" ? "white" : selectedTheme.text,
                      backgroundColor:
                        formState.water >= "2"
                          ? "#93b0ff"
                          : selectedTheme.background,
                      border: selectedTheme.lightBorder,
                    }}
                    htmlFor="water2"
                  >
                    2
                  </label>
                </div>

                <hr
                  className={styles.betweenChecks}
                  style={{ border: selectedTheme.lightBorder }}
                />

                <input
                  type="radio"
                  name="water"
                  id="water1"
                  value="1"
                  checked={formState.water === "1"}
                  onChange={handleFormChange}
                />
                <div className={styles.labelArea}>
                  <img
                    style={{
                      visibility:
                        formState.water === "1" ? "visible" : "hidden",
                    }}
                    src={smallBlueTick}
                    alt="small blue tick"
                  />
                  <label
                    style={{
                      boxShadow: formState.water === "1" ? "none" : "",
                      color:
                        formState.water === "1" ? "white" : selectedTheme.text,
                      backgroundColor:
                        formState.water >= "1"
                          ? "#93b0ff"
                          : selectedTheme.background,
                      border: selectedTheme.lightBorder,
                    }}
                    htmlFor="water1"
                  >
                    1
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.exerciseMeditationAndRelaxation}>
              <div className={styles.checkSection}>
                <input
                  type="checkbox"
                  name="exercise"
                  id="exercise"
                  checked={formState.exercise}
                  onChange={handleFormChange}
                  className={
                    selectedTheme.name === "black"
                      ? !formState.exercise && styles.darkCheckbox
                      : ""
                  }
                />
                <label htmlFor="exercise" style={{ color: selectedTheme.text }}>
                  EXERCISE
                </label>
              </div>
              <div className={styles.checkSection}>
                <input
                  type="checkbox"
                  name="meditation"
                  id="meditation"
                  checked={formState.meditation}
                  onChange={handleFormChange}
                  className={
                    selectedTheme.name === "black"
                      ? !formState.meditation && styles.darkCheckbox
                      : ""
                  }
                />
                <label
                  htmlFor="meditation"
                  style={{ color: selectedTheme.text }}
                >
                  MEDITATION
                </label>
              </div>
              <div className={styles.checkSection}>
                <input
                  type="checkbox"
                  name="relaxation"
                  id="relaxation"
                  checked={formState.relaxation}
                  onChange={handleFormChange}
                  className={
                    selectedTheme.name === "black"
                      ? !formState.relaxation && styles.darkCheckbox
                      : ""
                  }
                />
                <label
                  htmlFor="relaxation"
                  style={{ color: selectedTheme.text }}
                >
                  RELAXATION
                </label>
              </div>
            </div>
            <div
              className={styles.darkBottom}
              style={{ background: selectedTheme.darkBg }}
            >
              <div className={styles.happinessScale}>
                <div className={styles.labelSection}>
                  <img src={moon} alt="icon of moon" />
                  <label>TODAY'S HAPPY SCALE</label>
                </div>
                <div className={styles.happinessChecks}>
                  <img src={smiley10} alt="smiley 10" />
                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />

                  <input
                    type="radio"
                    name="happyScale"
                    id="happyScale10"
                    value="10"
                    checked={formState.happyScale === "10"}
                    onChange={handleFormChange}
                  />
                  <div className={styles.labelArea}>
                    <img
                      style={{
                        visibility:
                          formState.happyScale === "10" ? "visible" : "hidden",
                      }}
                      src={smallPinkTick}
                      alt="small Pink tick"
                    />
                    <label
                      style={{
                        boxShadow:
                          formState.happyScale === "10"
                            ? "0px 3px 3px #FF8BD0"
                            : "",
                        backgroundColor: "#363636",
                      }}
                      htmlFor="happyScale10"
                    >
                      10
                    </label>
                  </div>

                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />

                  <input
                    type="radio"
                    name="happyScale"
                    id="happyScale9"
                    value="9"
                    checked={formState.happyScale === "9"}
                    onChange={handleFormChange}
                  />
                  <div className={styles.labelArea}>
                    <img
                      style={{
                        visibility:
                          formState.happyScale === "9" ? "visible" : "hidden",
                      }}
                      src={smallPinkTick}
                      alt="small Pink tick"
                    />
                    <label
                      style={{
                        boxShadow:
                          formState.happyScale === "9"
                            ? "0px 3px 3px #FF8BD0"
                            : "",
                        backgroundColor: "#4A4A4A",
                      }}
                      htmlFor="happyScale9"
                    >
                      9
                    </label>
                  </div>

                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />

                  <input
                    type="radio"
                    name="happyScale"
                    id="happyScale8"
                    value="8"
                    checked={formState.happyScale === "8"}
                    onChange={handleFormChange}
                  />
                  <div className={styles.labelArea}>
                    <img
                      style={{
                        visibility:
                          formState.happyScale === "8" ? "visible" : "hidden",
                      }}
                      src={smallPinkTick}
                      alt="small Pink tick"
                    />
                    <label
                      style={{
                        boxShadow:
                          formState.happyScale === "8"
                            ? "0px 3px 3px #FF8BD0"
                            : "",
                        backgroundColor: "#5F5F5F",
                      }}
                      htmlFor="happyScale8"
                    >
                      8
                    </label>
                  </div>

                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />

                  <input
                    type="radio"
                    name="happyScale"
                    id="happyScale7"
                    value="7"
                    checked={formState.happyScale === "7"}
                    onChange={handleFormChange}
                  />
                  <div className={styles.labelArea}>
                    <img
                      style={{
                        visibility:
                          formState.happyScale === "7" ? "visible" : "hidden",
                      }}
                      src={smallPinkTick}
                      alt="small Pink tick"
                    />
                    <label
                      style={{
                        boxShadow:
                          formState.happyScale === "7"
                            ? "0px 3px 3px #FF8BD0"
                            : "",
                        backgroundColor: "#727272",
                      }}
                      htmlFor="happyScale7"
                    >
                      7
                    </label>
                  </div>

                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />

                  <input
                    type="radio"
                    name="happyScale"
                    id="happyScale6"
                    value="6"
                    checked={formState.happyScale === "6"}
                    onChange={handleFormChange}
                  />
                  <div className={styles.labelArea}>
                    <img
                      style={{
                        visibility:
                          formState.happyScale === "6" ? "visible" : "hidden",
                      }}
                      src={smallPinkTick}
                      alt="small Pink tick"
                    />
                    <label
                      style={{
                        boxShadow:
                          formState.happyScale === "6"
                            ? "0px 3px 3px #FF8BD0"
                            : "",
                        backgroundColor: "#878787",
                      }}
                      htmlFor="happyScale6"
                    >
                      6
                    </label>
                  </div>

                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />

                  <input
                    type="radio"
                    name="happyScale"
                    id="happyScale5"
                    value="5"
                    checked={formState.happyScale === "5"}
                    onChange={handleFormChange}
                  />
                  <div className={styles.labelArea}>
                    <img
                      style={{
                        visibility:
                          formState.happyScale === "5" ? "visible" : "hidden",
                      }}
                      src={smallPinkTick}
                      alt="small pink tick"
                    />
                    <label
                      style={{
                        boxShadow:
                          formState.happyScale === "5"
                            ? "0px 3px 3px #FF8BD0"
                            : "",
                        backgroundColor: "#9A9A9A",
                      }}
                      htmlFor="happyScale5"
                    >
                      5
                    </label>
                  </div>

                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />

                  <input
                    type="radio"
                    name="happyScale"
                    id="happyScale4"
                    value="4"
                    checked={formState.happyScale === "4"}
                    onChange={handleFormChange}
                  />
                  <div className={styles.labelArea}>
                    <img
                      style={{
                        visibility:
                          formState.happyScale === "4" ? "visible" : "hidden",
                      }}
                      src={smallPinkTick}
                      alt="small Pink tick"
                    />
                    <label
                      style={{
                        boxShadow:
                          formState.happyScale === "4"
                            ? "0px 3px 3px #FF8BD0"
                            : "",
                        backgroundColor: "#AEAEAE",
                      }}
                      htmlFor="happyScale4"
                    >
                      4
                    </label>
                  </div>

                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />

                  <input
                    type="radio"
                    name="happyScale"
                    id="happyScale3"
                    value="3"
                    checked={formState.happyScale === "3"}
                    onChange={handleFormChange}
                  />
                  <div className={styles.labelArea}>
                    <img
                      style={{
                        visibility:
                          formState.happyScale === "3" ? "visible" : "hidden",
                      }}
                      src={smallPinkTick}
                      alt="small Pink tick"
                    />
                    <label
                      style={{
                        boxShadow:
                          formState.happyScale === "3"
                            ? "0px 3px 3px #FF8BD0"
                            : "",
                        backgroundColor: "#C2C2C2",
                      }}
                      htmlFor="happyScale3"
                    >
                      3
                    </label>
                  </div>

                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />

                  <input
                    type="radio"
                    name="happyScale"
                    id="happyScale2"
                    value="2"
                    checked={formState.happyScale === "2"}
                    onChange={handleFormChange}
                  />
                  <div className={styles.labelArea}>
                    <img
                      style={{
                        visibility:
                          formState.happyScale === "2" ? "visible" : "hidden",
                      }}
                      src={smallPinkTick}
                      alt="small Pink tick"
                    />
                    <label
                      style={{
                        boxShadow:
                          formState.happyScale === "2"
                            ? "0px 3px 3px #FF8BD0"
                            : "",
                        backgroundColor: "#D6D6D6",
                      }}
                      htmlFor="happyScale2"
                    >
                      2
                    </label>
                  </div>

                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />

                  <input
                    type="radio"
                    name="happyScale"
                    id="happyScale1"
                    value="1"
                    checked={formState.happyScale === "1"}
                    onChange={handleFormChange}
                  />
                  <div className={styles.labelArea}>
                    <img
                      style={{
                        visibility:
                          formState.happyScale === "1" ? "visible" : "hidden",
                      }}
                      src={smallPinkTick}
                      alt="small Pink tick"
                    />
                    <label
                      style={{
                        boxShadow:
                          formState.happyScale === "1"
                            ? "0px 3px 3px #FF8BD0"
                            : "",
                        backgroundColor: "#E9E9E9",
                      }}
                      htmlFor="happyScale1"
                    >
                      1
                    </label>
                  </div>

                  <hr
                    className={styles.betweenChecks}
                    style={{ border: selectedTheme.lightBorder }}
                  />
                  <img src={smiley1} alt="smiley 1" />
                </div>
              </div>
              <div className={styles.gratefulForAndOther}>
                <div
                  className={styles.excitedAboutToday}
                  style={{ borderColor: selectedTheme.darkBorder }}
                >
                  <label
                    htmlFor="happyAboutToday"
                    style={{ color: selectedTheme.text }}
                  >
                    TODAY'S HAPPY MOMENT
                  </label>
                  <ContentEditable
                    id="excitedAboutToday"
                    className={styles.excitedAboutInput}
                    html={formState.happyMoment.replaceAll("\n", "<br>")}
                    disabled={false}
                    onChange={(e) => {
                      e.target.name = "happyMoment";
                      handleFormChange(e);
                    }}
                    style={{
                      borderBottom: selectedTheme.borders,
                      color: selectedTheme.inputText,
                    }}
                  />
                </div>
                <div className={styles.gratefulFor}>
                  <label
                    htmlFor="gratefulForTonight"
                    style={{ color: selectedTheme.text }}
                  >
                    TONIGHT I'M GRATEFUL FOR
                  </label>

                  <ContentEditable
                    id="gratefulFor"
                    className={styles.gratefulForInput}
                    html={formState.gratefulForTonight.replaceAll("\n", "<br>")}
                    disabled={false}
                    onChange={(e) => {
                      e.target.name = "gratefulForTonight";
                      handleFormChange(e);
                    }}
                    style={{
                      borderBottom: selectedTheme.borders,
                      color: selectedTheme.inputText,
                    }}
                  />
                </div>
              </div>
              <div className={styles.dailyQuestion}>
                <label style={{ color: selectedTheme.text }}>
                  TODAY'S QUESTION
                </label>
                <textarea
                  rows={1}
                  name="excitedAbout"
                  id="excitedAboutToday"
                  onKeyUp={(e) => {
                    e.target.style.height = "22px";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.height = "22px";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  value={answerToDailyQuestion}
                  onChange={(e) => {
                    answerForDailyQuestion(e.target.value);
                  }}
                  className={styles.excitedAboutInput}
                  style={{
                    backgroundColor: selectedTheme.darkBg,
                    borderBottom: selectedTheme.borders,
                    color: selectedTheme.inputText,
                  }}
                ></textarea>
              </div>
            </div>
          </form>
          <div
            className={styles.datePicker}
            style={{
              background: selectedTheme.darkBg,
              borderLeftColor: selectedTheme.dateBorder,
            }}
          >
            <button
              className={styles.calendarIcon}
              onClick={() => {
                const current =
                  displayMonthsOrYears === "months" ? "years" : "months";
                setDisplayMonthsOrYears(current);
              }}
            >
              {displayMonthsOrYears === "months" ? (
                <img src={calendar} alt="icon of calendar" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
            <div className={styles.selectors}>
              <div className={styles.days}>
                {Array.from(Array(daysInMonths[dateState.month]).keys()).map(
                  (day, idx) => {
                    return (
                      <button
                        key={idx}
                        onClick={async (e) => {
                          syncPlan(payload, date);
                          if (day + 1 !== dateState.day) {
                            storePlanInDb();
                            clearState();
                            setDateState({ ...dateState, day: day + 1 });
                            setCurrentDay(day + 1);
                          }
                        }}
                        style={{
                          fontFamily: "Quicksand",
                          border:
                            day + 1 === currentDay
                              ? "0.5px solid #FFEFEF"
                              : `0.5px solid ${selectedTheme.dateBorder}`,
                          backgroundColor:
                            day + 1 === currentDay
                              ? "#000000"
                              : selectedTheme.dateBg,
                          color: day + 1 === currentDay ? "white" : "#dc60a8",
                        }}
                        className={styles.day}
                      >
                        {day + 1}
                      </button>
                    );
                  }
                )}
              </div>
              <div className={styles.monthsOrYears}>
                {displayMonthsOrYears === "months" ? (
                  <div
                    className={styles.period}
                    style={{
                      background: selectedTheme.dateBg,
                      border: `0.5px solid ${selectedTheme.dateBorder}`,
                    }}
                  >
                    {monthNames.map((month, idx) => {
                      return (
                        <button
                          onClick={(e) => {
                            syncPlan(payload, date);
                            storePlanInDb();
                            clearState();
                            setDateState({ ...dateState, month: month });
                            setCurrentMonth(month);
                          }}
                          style={{
                            fontFamily: "Varela Round",
                            border:
                              month === currentMonth ? "1px solid #FFEFEF" : "",
                            backgroundColor:
                              month === currentMonth
                                ? "#000000"
                                : selectedTheme.dateBg,
                            color: month === currentMonth ? "white" : "#dc60a8",
                          }}
                          key={idx}
                        >
                          {month.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={styles.period}
                    style={{
                      background: selectedTheme.dateBg,
                      border: `0.5px solid ${selectedTheme.dateBorder}`,
                    }}
                  >
                    {years.map((year, idx) => {
                      return (
                        <button
                          key={idx}
                          onClick={(e) => {
                            syncPlan(payload, date);
                            storePlanInDb();
                            clearState();
                            setDateState({ ...dateState, year: year });
                            setCurrentYear(year);
                          }}
                          style={{
                            fontFamily: "Quicksand",
                            border:
                              year === currentYear ? "1px solid #FFEFEF" : "",
                            backgroundColor:
                              year === currentYear
                                ? "#000000"
                                : selectedTheme.dateBg,
                            color: year === currentYear ? "white" : "#dc60a8",
                          }}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        className={styles.planToggle}
        onClick={() => {
          togglePlan();

          if (visible === true) {
            storePlanInDb();
          }
        }}
      >
        {visible ? (
          <span
            style={{
              height: "25.74px",
              width: "19px",
              borderRadius: "2.5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              marginTop: "-30px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 planToggleImg"
              style={{
                height: "21px",
                width: "21px",
                stroke: "#dc60a8",
                strokeWidth: "2px",
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        ) : (
          <img src={plan} alt="plan icon " className="plan-icon" />
        )}
      </button>
    </div>
  );
};

export default Plan;
