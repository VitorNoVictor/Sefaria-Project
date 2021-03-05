import {
  IntText,
  NBox,
} from './Misc';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes  from 'prop-types';
import classNames  from 'classnames';
import Sefaria  from './sefaria/sefaria';
import $  from './sefaria/sefariaJquery';
import MobileHeader from './MobileHeader';
import NavSidebar from './NavSidebar';
import Footer  from './Footer';
import Component from 'react-class';


const CalendarsPage = ({multiPanel}) => {

  const initialWidth = multiPanel ? 1000 : 500; // Assume we're in a small panel if we're hiding the nav header
  const [width, setWidth] = useState(initialWidth);

  const ref = useRef(null);
  useEffect(() => {
    deriveAndSetWidth();
    window.addEventListener("resize", deriveAndSetWidth);
    return () => {
        window.removeEventListener("resize", deriveAndSetWidth);
    }
  }, []);

  const deriveAndSetWidth = () => setWidth(ref.current ? ref.current.offsetWidth : initialWidth);

  const calendars = reformatCalendars();

  const parashaCalendars = ["Parashat Hashavua", "Haftarah (A)", "Haftarah (S)"];
  const dailyCalendars   = ["Daf Yomi", "929", "Daily Mishnah", "Daily Rambam", "Daily Rambam (3)", "Halakhah Yomit"];
  const weeklyCalendars  = ["Daf a Week"];

  const makeListings = list => calendars.filter(c => list.indexOf(c.title.en) != -1)
                              .map(c => <CalendarListing calendar={c} />);

  const parashaListings = makeListings(parashaCalendars);
  const dailyListings   = makeListings(dailyCalendars);
  const weeklyListings  = makeListings(weeklyCalendars);

  const sidebarModules = [
    {type: "AboutStudySchedules"},
    {type: "StayConnected"},
    {type: "SupportSefaria"},
  ];

  const classes = classNames({readerNavMenu:1, noHeader: 1 });
  const contentClasses = classNames({content: 1, hasFooter: 1});

  return(<div ref={ref} className={classes} key="0">
          <div className={contentClasses}>
            <div className="sidebarLayout">
              <div className="contentInner">
                <h2 className="styledH1"><IntText>Weekly Torah Portion</IntText></h2>
                <div className="readerNavCategories">
                  <NBox content={parashaListings} n={2} />
                </div>
                <h2 className="styledH1"><IntText>Daily Study</IntText></h2>
                <div className="readerNavCategories">
                  <NBox content={dailyListings} n={2} />
                </div>
                <h2 className="styledH1"><IntText>Weekly Study</IntText></h2>
                <div className="readerNavCategories">
                  <NBox content={weeklyListings} n={2} />
                </div>
              </div>
              <NavSidebar modules={sidebarModules} />
            </div>
            <Footer />
          </div>
        </div>);
};


const CalendarListing = ({calendar}) => {
  const style = {"borderColor": Sefaria.palette.categoryColor(calendar.category)};
  return <div className="navBlock withColorLine" style={style}>
          <a href={`/${calendar.url}`} className="navBlockTitle">
            <span className="en">{calendar.displayTitle.en}</span>
            <span className="he">{calendar.displayTitle.he}</span>
          </a>
          <div className="calendarRef">
            <img src="/static/img/book-icon-black.svg" className="navSidebarIcon" alt="book icon" />
            <a href={`/${calendar.url}`} className="">
              <span className="en">{calendar.displayValue.en}</span>
              <span className="he">{calendar.displayValue.he}</span>
            </a> 
          </div>          
          { calendar.description ?
          <div className="navBlockDescription">
            <span className="en">{calendar.description.en}</span>
            <span className="he">{calendar.description.he}</span>
          </div>
          : null}
        </div>
};


const reformatCalendars = () => {
  const calendars = Sefaria.util.clone(Sefaria.calendars);
  calendars.map(cal => {
    let calData = calendarDescriptions[cal.title.en.replace(/ \([AS]\)$/, "")]
    if (!calData) debugger
    if (!cal.description) {
      cal.description = {en: calData.en, he: calData.he};
    }
    if (cal.title.en == "Parashat Hashavua") {
      cal.displayTitle = cal.displayValue;
      cal.displayValue = {en: cal.ref, he: cal.heRef};
    } else {
      cal.displayTitle = Sefaria.util.clone(cal.title);
      if (calData.enDisplayTitle) {
        cal.displayTitle.en = calData.enDisplayTitle;
      }
    }
  });

  return calendars;
};

const calendarDescriptions = {
  "Parashat Hashavua": {},
  "Haftarah": {
    en: "The portion from Prophets (a section of the Bible) read on any given week, based on its thematic connection to the weekly Torah portion.",
    he: ""
  },
  "Daf Yomi": {
    en: "A study program that covers a page of Talmud a day. In this way, the entire Talmud is completed in about seven and a half years.",
    he: "",
    enDisplayTitle: "Talmud (Daf Yomi)",
  },
  "929": {
    en: "A study program in which participants study five of the Bible’s 929 chapters a week, completing it in about three and a half years.",
    he: ""
  },
  "Daily Mishnah": {
    en: "A program of daily study in which participants study two Mishnahs (teachings) each day in order to finish the entire Mishnah in six years.",
    he: ""
  },
  "Daily Rambam": {
    en: "A study program that divides Maimonides’ Mishneh Torah legal code into daily units, to complete the whole work in three years.",
    he: ""
  },
  "Daily Rambam (3)": {
    en: "A study program that divides Maimonides’ Mishneh Torah legal code into daily units, to complete the whole work in one year.",
    he: "",
    enDisplayTitle: "Daily Rambam (3 Chapters)",
  },
  "Daf a Week": {
    en: "A study program  that covers a page of Talmud a week. By going at a slower pace, it facilitates greater mastery and retention.",
    he: "",
    enDisplayTitle: "Talmud (Daf a Week)"
  },
  "Halakhah Yomit": {
    en: "A four year daily study program in which participants study central legal texts that cover most of the daily and yearly rituals.",
    he: ""
  },
}


export default CalendarsPage;