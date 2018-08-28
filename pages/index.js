import React from "react";
import Head from "next/head";
import Link from "next/link";

import axios from 'axios';

import Global from "./_global.js";

import styles from './index.scss';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      topics: {},
      level: "",
      contact: {
        fname: "",
        lname: "",
        email: "",
        phone: -1
      },
      contactValid: false,
      sendingData: false,
      stepNum: 1
    }

    this.toggleTopic = this.toggleTopic.bind(this);
    this.toggleLevel = this.toggleLevel.bind(this);
    this.adjustStepNum = this.adjustStepNum.bind(this);
    this.isValidContact = this.isValidContact.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  toggleTopic(topicName) {
    let curTopics = this.state.topics,
      newTopics = curTopics;

    // Remove
    if (curTopics[topicName]) {
      delete newTopics[topicName];
    }
    // Add
    else {
      newTopics[topicName] = true;
    }

    this.setState({
      topics: newTopics,
      active: !this.state.active
    }, () => {
      console.log("Added/removed topic", this.state);
    })
  }

  toggleLevel(levelName) {
    this.setState({
      level: levelName,
    }, () => {
      console.log("Adjusted level", this.state)
    })
  }

  adjustStepNum(upOrDown) {
    let curStep = this.state.stepNum,
      newStep = (upOrDown === 1) ? curStep + 1 : curStep - 1;

    this.setState({
      stepNum: newStep
    }, () => {
      console.log("Incremented step num", this.state);
    })
  }

  isValidContact(contactState = null, alertFlag = false) {
    if (contactState) {
      let {
        fname,
        lname,
        email,
        phone
      } = contactState,
      emailTest =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let phoneTest = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        windowExists = (typeof window !== 'undefined');

      if (!fname ||
        fname.length < 1 ||
        !lname ||
        lname.length < 1
      ) {
        if (alertFlag && windowExists) alert("Invalid first or last name! Please check your name!")
        return false;
      } else if (!email ||
        email.length < 1 ||
        !emailTest.test(email.toLowerCase())
      ) {
        if (alertFlag && windowExists) alert("Invalid email address! Please check your email address!")
        return false;
      } else if (!phone ||
        phone.length < 9 ||
        !phoneTest.test(phone)) {
        if (alertFlag && windowExists) alert("Invalid phone number! Please check your phone number!")
        return false;
      }

      return true;
    } else {
      return false;
    }
  }

  handleInput(key, value) {
    if (key && value) {
      let oldContact = this.state.contact,
        newContact = oldContact;

      newContact[key] = value;
      this.setState({
        contact: newContact
      }, () => {
        console.log("Updated contact info!", this.state);
        (this.isValidContact(this.state.contact)) ? (
          this.setState({
            contactValid: true
          }, () => {
            console.log("Valid contact", this.state);
          })
        ) : (
          this.setState({
            contactValid: false
          }, () => {
            console.log("Invalid contact", this.state);
          })
        )
      })
    }
  }

  sendData() {
    if (this.state.contactValid) {
      this.setState({
        sendingData: true
      }, () => {
        console.log("Updated data sending state true...")
      })

      const {
        topics,
        level,
        contact
      } = this.state, {
        fname,
        lname,
        email,
        phone
      } = contact;

      // If all set, then POST to DB
      let POST_URL = 'https://script.google.com/macros/s/AKfycbxAutMMJVGtElp8KG8aY-T350imvCeoBzUgmh5aqmcfjLquDApA/exec';
      POST_URL += `?topics=${ JSON.stringify(topics) }`
      POST_URL += `&level=${ level.toString() }`
      POST_URL += `&fname=${ fname.toString() }`
      POST_URL += `&lname=${ lname.toString() }`
      POST_URL += `&email=${ email.toString() }`
      POST_URL += `&phone=${ phone.toString() }`

      axios.get(POST_URL)
        .then((resp) => {
          console.log("POSTed data to DB.", resp)
          // Increment step #
          this.adjustStepNum(1)
          // Adjust sending state
          this.setState({
            sendingData: false
          }, () => {
            console.log("Updated data sending state to false...")
          })
        })
        .catch((err) => {
          if (err) console.log("Error occured while posting", err);
          alert("An error occured while adding you to the list!");
          // Adjust sending state
          this.setState({
            sendingData: false
          }, () => {
            console.log("Updated data sending state to false...")
          })
        });
    } else {
      alert("Invalid contact information!");
    }
  }

  render() {
    let topicSelected = (Object.keys(this.state.topics).length > 0),
      levelSelected = this.state.level !== "",
      validContact = this.state.contactValid,
      step = <div>Unknown step</div>,
      {
        stepNum
      } = this.state;

    if (stepNum === 1) {
      step = (
        <div className="step one" id="stepOne">
        <div className="sectionTitle">
          <div className="titleText">
            <h1>step &#x261D;
              <span className="faded">
               1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;1&nbsp;
              </span>
            </h1>
          </div>
          <div className="subtitleText">
            <p>Choose your topic(s).<br/>You may choose as many as you would like.</p>
          </div>
        </div>
        <div className="stepContent">
          <ul className="topicList">
            <li className={ `topicListItem cs ${ this.state.topics['cs'] ? 'active' : '' }`} onClick={ () => this.toggleTopic('cs') }>
              <div className="topicListItemWrap">
                <div className="checkBox"></div>
                <div className="topicTitle">
                  <h6>&#x1F4BB;&nbsp;technology</h6>
                </div>
                <div className="topicImg">
                  {
                    // TODO
                  }
                </div>
              </div>
            </li>
            <li className={ `topicListItem hist ${ this.state.topics['hist'] ? 'active' : '' }`} onClick={ () => this.toggleTopic('hist') }>
              <div className="topicListItemWrap">
                <div className="checkBox"></div>
                <div className="topicTitle">
                  <h6>&#x23F3;&nbsp;history</h6>
                </div>
                <div className="topicImg">
                  {
                    // TODO
                  }
                </div>
              </div>
            </li>
            <li className={ `topicListItem econ ${ this.state.topics['econ'] ? 'active' : '' }`} onClick={ () => this.toggleTopic('econ') }>
              <div className="topicListItemWrap">
                <div className="checkBox"></div>
                <div className="topicTitle">
                  <h6>&#x1F4B0;&nbsp;economics</h6>
                </div>
                <div className="topicImg">
                  {
                    // TODO
                  }
                </div>
              </div>
            </li>
            <li className={ `topicListItem des ${ this.state.topics['des'] ? 'active' : '' }`} onClick={ () => this.toggleTopic('des') }>
              <div className="topicListItemWrap">
                <div className="checkBox"></div>
                <div className="topicTitle">
                  <h6>&#x1F58C;&nbsp;design</h6>
                </div>
                <div className="topicImg">
                  {
                    // TODO
                  }
                </div>
              </div>
            </li>
          </ul>
          <div className="continueBtn">
            <button
              className={ topicSelected ? 'active' : 'inactive' }
              type="button"
              disabled={ topicSelected ? false : true }
              onClick= { this.props.disabled ? null : () => this.adjustStepNum(1) }>{
              topicSelected ? (
                <span dangerouslySetInnerHTML={{__html: 'Continue (2/3)&nbsp;&#x23E9;'}}/>
              ) : (
                <span dangerouslySetInnerHTML={{__html: 'Choose A Topic To Continue &#x1F44D;'}}/>
              )
            }</button>
          </div>
        </div>
        <style jsx>{ styles }</style>
      </div>
      )
    } else if (stepNum === 2) {
      step = (
        <div className="step two" id="stepTwo">
        <div className="sectionTitle">
          <div className="titleText">
            <h1>step &#x270C;
              <span className="faded">
               2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;2&nbsp;
              </span>
            </h1>
          </div>
          <div className="subtitleText">
            <p>Choose your level of detail.<br/><b>Factoids</b> are 280 - 560 characters,<br/><b>Summaries</b> are 1 - 2 paragraphs &amp;<br/><b>In Depth</b> is a breif exploration.</p>
          </div>
        </div>
        <div className="stepContent">
          <ul className="topicList">
            <li className={ `topicListItem factoid ${ this.state.level === 'factoid' ? 'active' : '' }`} onClick={ () => this.toggleLevel('factoid') }>
              <div className="topicListItemWrap">
                <div className="checkBox"></div>
                <div className="topicTitle">
                  <h6>&#x26A1;&nbsp;factoid</h6>
                </div>
                <div className="topicImg">
                  {
                    // TODO
                  }
                </div>
              </div>
            </li>
            <li className={ `topicListItem summary ${ this.state.level === 'summary' ? 'active' : '' }`} onClick={ () => this.toggleLevel('summary') }>
              <div className="topicListItemWrap">
                <div className="checkBox"></div>
                <div className="topicTitle">
                  <h6>&#x1F4CB;&nbsp;summary</h6>
                </div>
                <div className="topicImg">
                  {
                    // TODO
                  }
                </div>
              </div>
            </li>
            <li className={ `topicListItem inDepth ${ this.state.level === 'inDepth' ? 'active' : '' }`} onClick={ () => this.toggleLevel('inDepth') }>
              <div className="topicListItemWrap">
                <div className="checkBox"></div>
                <div className="topicTitle">
                  <h6>&#x1F4DA;&nbsp;in depth</h6>
                </div>
                <div className="topicImg">
                  {
                    // TODO
                  }
                </div>
              </div>
            </li>
          </ul>
          <div className="continueBtn">
            <button
              className={ levelSelected ? 'active' : 'inactive' }
              type="button"
              disabled={ levelSelected ? false : true }
              onClick= { this.props.disabled ? null : () => this.adjustStepNum(1) }>{
              levelSelected ? (
                <span dangerouslySetInnerHTML={{__html: 'Continue (3/3)&nbsp;&#x23E9;'}}/>
              ) : (
                <span dangerouslySetInnerHTML={{__html: 'Choose A Level To Continue &#x1F44D;'}}/>
              )
            }</button>
          </div>
          <div className="continueBtn backBtn">
            <button
              className={ levelSelected ? 'inactive' : 'active' }
              type="button"
              onClick= { () => this.adjustStepNum(-1) }>&#x23EA;&nbsp;Back To Topics</button>
          </div>
        </div>
        <style jsx>{ styles }</style>
      </div>
      )
    } else if (stepNum === 3) {
      step = (
        <div className="step three" id="stepThree">
          <div className="sectionTitle">
            <div className="titleText">
              <h1>step &#x261D;&#x261D;&#x261D;
                <span className="faded">
                 3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;3&nbsp;
                </span>
              </h1>
            </div>
            <div className="subtitleText">
              <p>Almost there! Enter your &#128241; phone # and &#128232; email address to receive your bytes:</p>
            </div>
          </div>
          <div className="stepContent">
            <div className="contactWrap">
              <div className="inputWrap">
                <label htmlFor="fname">First Name (ex: John)</label>
                <input type="text" id="#fname" name="fname" className="tb-input text" placeholder="First Name" autoComplete="new-password" onBlur={ (e) => this.handleInput('fname', e.target.value) }/>
              </div>
              <div className="inputWrap">
                <label htmlFor="lname">Last Name (ex: Doe)</label>
                <input type="text" id="#lname" name="lname" className="tb-input text" placeholder="Last Name" autoComplete="new-password" onBlur={ (e) => this.handleInput('lname', e.target.value) }/>
              </div>
              <div className="inputWrap">
                <label htmlFor="email">Email Address (ex: johndoe@email.com)</label>
                <input type="email" id="#email" name="email" className="tb-input email" placeholder="Email Address" autoComplete="new-password" onBlur={ (e) => this.handleInput('email', e.target.value) }/>
              </div>
              <div className="inputWrap">
                <label htmlFor="phone">Phone Number (No Spaces Or Dashes)</label>
                <input type="number" id="#phone" name="phone" className="tb-input phone" placeholder="Phone Number" autoComplete="new-password" onBlur={ (e) => this.handleInput('phone', e.target.value) }/>
              </div>
            </div>
            <div className="continueBtn">
              <button
                className={ validContact ? 'active' : 'inactive' }
                type="button"
                disabled={ validContact ? false : true }
                onClick= { this.props.disabled ? null : () => this.sendData() }>{
                validContact ? (
                  this.state.sendingData ? (
                    <span dangerouslySetInnerHTML={{__html: 'Sending Data...&#9203;'}}/>
                  ) : (
                    <span dangerouslySetInnerHTML={{__html: 'Click To Complete&nbsp;&#x2714;'}}/>
                  )
                ) : (
                  <span dangerouslySetInnerHTML={{__html: 'Enter Details To Complete &#x1F44D;'}}/>
                )
              }</button>
            </div>
            <div className="continueBtn backBtn">
              <button
                className={ validContact ? 'inactive' : 'active' }
                type="button"
                onClick= { () => this.adjustStepNum(-1) }>&#x23EA;&nbsp;Back To Levels</button>
            </div>
          </div>
          <style jsx>{ styles }</style>
        </div>
      )
    } else if (stepNum === 4) {
      step = (
        <div className="step four" id="stepFour">
          <div className="sectionTitle">
            <div className="titleText">
              <h1>All set &#x1F44D;
                <span className="faded">
                 &#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;&#x2B50;&nbsp;
                </span>
              </h1>
            </div>
            <div className="subtitleText wide">
              <p>
                <b>NOTE: A TINY BYTE WILL GO LIVE SEPTEMBER 1ST, 2018. PLEASE STAY TUNED TILL THEN & THANK YOU FOR JOINING THIS EXPERIMENT!</b>
                <br/><br/>
                You're all set! Your tiny bytes will be delivered every week day at 9AM ET in your messages and inbox! Be sure to whitelist <a href="mailto:bytes@atinybyte.com">bytes@atinybyte.com</a> to receive the emails.
                <br/><br/>
                Of course you can unsubscribe at any time by replying to the texts with the word "STOP" or by clicking the unsubscribe link in the email!
                <br/><br/>
                Thank's for being a part of this experiment... I hope you find it as useful and fun as I did building it. If you like the idea and want to know how you can be a part, shoot me a message at <a href="mailto:hello@atinybyte.com">hello@atinybyte.com</a>.
                <br/><br/>
                Cheers!
                <br/>
                Abhi (a.k.a anayar)
              </p>
            </div>
          </div>
          <div className="stepContent">
          </div>
          <style jsx>{ styles }</style>
        </div>
      )
    }

    return (
      <div id="app">
        <Head>
          <title>A Tiny Byte - A daily text to expand your mind.</title>
        </Head>
        <div id="home">
          <div className="page-wrap">
            <div className="header">
              <div id="siteName">
                <h1><a href="/">a&nbsp;<span className="tiny">tiny</span>&nbsp;byte&nbsp;&#128172;</a></h1>
                <div className="siteSubtitle">
                  <p>A daily text to expand your mind.</p>
                </div>
              </div>
              <div id="siteNav">
                <a href="#about">About</a>
                <a href="mailto:hello@atinybyte.com?subject=Contributing%20to%20A%20Tiny%20Byte&body=I'd%20love%20your%20help%20writing%20posts%20for%20A%20Tiny%20Byte!%20If%20you're%20interested%20in%20Tech%2C%20Econ%2C%20History%2C%20Design%20or%20any%20other%20topics%2C%20simply%20write%20me%20here%20and%20I'd%20love%20to%20work%20with%20you!%20Thanks%20for%20your%20help%20%3A)%0A%0ACheers%2C%0AAbhi">Contribute</a>
                {/* <a href="#">Past Bytes</a> */}
                <a href="#privacy" className="em">Privacy</a>
              </div>
            </div>
            <div className="body">
              <div className="stepWrap pageSection" id="steps">
                {
                  step
                }
              </div>
              <div className="aboutWrap pageSection" id="about">
                <div className="sectionTitle">
                  <div className="titleText">
                    <h1>about &#x2753;</h1>
                    <span className="faded spaced">
                     ?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;?&nbsp;
                    </span>
                  </div>
                  <div className="subtitleText wide">
                    <p>
                      Begin by choosing the topics that interest you. Then choose the level of detail you would like - quick fact, summary or in-depth analysis, and finish by choosing your method of delivery.
                      <br/><br/>
                      A tiny byte of information will be delivered to you every week day on the topic you chose - ranging from current events to ancient history. Something interesting and fresh every. single. day.
                      <br/><br/>
                      A tiny byte is a project by <a href="https://linkedin.com/in/abhinayar" target="_blank">Abhi Nayar (a.k.a anayar)</a>.
                      <br/><br/>
                      It is an attempt to provide a daily dose of relevant information, primarily to help myself grow and make sure I learn something new each and every day but also to share with a few people out in the world.
                      <br/><br/>
                      A tiny byte was created as a result of a birthday resolution to (a) build more projects and (b) write something new every day, checking both off the resolution list. Enjoy!
                      <br/><br/>
                      <span className="bold">Questions? Comments? Concerns?</span>
                      <br/><br/>
                      Contact me at <a href="mailto:hello@atinybyte.com">hello@atinybyte.com</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="privWrap pageSection" id="privacy">
                <div className="sectionTitle">
                  <div className="titleText">
                    <h1>privacy policy &#x1F512;</h1>
                    <span className="faded spaced">
                     !&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;!&nbsp;&nbsp;
                    </span>
                  </div>
                  <div className="subtitleText wide">
                    <p>
                      Your information will never be shared with anyone. Period. All provided information will only be used for sending you a daily/weekly byte.
                      <br/><br/>
                      <b>I will track the following:</b>
                      <br/>
                      - Open rates on emails
                      <br/>
                      - Click rates on emails
                      <br/>
                      - Open rate on texts
                      <br/>
                      - Click rates on texts
                      <br/><br/>
                      By signing up you opt-in to a daily short text message and email with information on the topic of your choosing. You can stop receiving texts/emails at any time by texting STOP to the byte message or clicking the unsubscribe link in any email.
                      <br/><br/>
                      <span className="bold">Questions? Comments? Concerns?</span>
                      <br/><br/>
                      Contact me at <a href="mailto:hello@atinybyte.com">hello@atinybyte.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="footerInner">
              <div id="siteName">
                <h1>a&nbsp;<span className="tiny">tiny</span>&nbsp;byte&nbsp;&#128172;</h1>
                <div className="siteSubtitle">
                  <p>A daily text to expand your mind.</p>
                </div>
              </div>
              <div id="siteNav">
                <a href="#about">About</a>
                {/* <a href="/past-bytes">Past Bytes</a> */}
                <a href="mailto:hello@atinybyte.com?subject=Contributing%20to%20A%20Tiny%20Byte&body=I'd%20love%20your%20help%20writing%20posts%20for%20A%20Tiny%20Byte!%20If%20you're%20interested%20in%20Tech%2C%20Econ%2C%20History%2C%20Design%20or%20any%20other%20topics%2C%20simply%20write%20me%20here%20and%20I'd%20love%20to%20work%20with%20you!%20Thanks%20for%20your%20help%20%3A)%0A%0ACheers%2C%0AAbhi">
                  Contribute
                </a>
                <a href="#privacy" className="em">Privacy</a>
              </div>
              <div id="attr"></div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          /* minireset.css v0.0.3 | MIT License | github.com/jgthms/minireset.css */
          blockquote,
          body,
          dd,
          dl,
          dt,
          fieldset,
          figure,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          hr,
          html,
          iframe,
          legend,
          li,
          ol,
          p,
          pre,
          textarea,
          ul {
            margin: 0;
            padding: 0;
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-size: 100%;
            font-weight: normal;
          }

          ul {
            list-style: none;
          }

          button,
          input,
          select,
          textarea {
            margin: 0;
          }

          html {
            box-sizing: border-box;
          }

          *,
          *:after,
          *:before {
            box-sizing: border-box;
            text-rendering: optimizeLegibility;
            -webkit-tap-highlight-color: transparent;
          }

          audio,
          embed,
          iframe,
          img,
          object,
          video {
            height: auto;
            max-width: 100%;
          }

          iframe {
            border: 0;
          }

          table {
            border-collapse: collapse;
            border-spacing: 0;
          }

          td,
          th {
            padding: 0;
            text-align: left;
          }
          /* font face declarations */

          body {
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            font-family: 'Karla', 'Poppins';
            font-size: 18px;
            font-weight: 400;
            color: #777;
            border-top: 12px solid #e14f3d;
            border-bottom: 12px solid #e14f3d;
          }

          a,
          p {
            letter-spacing: 0.08em;
          }

        `}</style>
        <style jsx>{styles}</style>
      </div>
    );
  }
}

export default Home;
