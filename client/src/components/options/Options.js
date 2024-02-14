import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Input, Button, Tooltip, Modal, message } from "antd";
import Phone from "../../assests/phone.gif";
import Teams from "../../assests/teams.mp3";
import styles from "./Options.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import VideoContext from "../../context/VideoContext";
// import Hang from "../../assests/hang.svg";
import {
  TwitterIcon,
  TwitterShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon,
  FacebookShareButton,
} from "react-share";
import {
  UserOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { socket } from "../../context/VideoState";

const Options = () => {
  const [idToCall, setIdToCall] = useState("");
  const [callId, setCallId] = useState("Enter code to call");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const Audio = useRef();
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
    setOtherUser,
    leaveCall1,
        // setMessageReceived,
  } = useContext(VideoContext);
  
  useEffect(() => {
    if (isModalVisible) {
      Audio?.current?.play();
    } else Audio?.current?.pause();
  }, [isModalVisible]);

  const showModal = (showVal) => {
    setIsModalVisible(showVal);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    leaveCall1();
    window.location.reload();
  };
  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      setIsModalVisible(true);
      setOtherUser(call.from);
    } else setIsModalVisible(false);
  }, [call.isReceivingCall]);
  return (
    <>
    <div className={styles.options}>
      <div className={styles.name} style={{display:"inline-flex" ,textAlign:"center" ,justifyContent:"space-around"}}>
      <div>

      <p2 >Your Name</p2>
        <Input
          size="large"
          placeholder="Your name"
          prefix={<UserOutlined />}
          maxLength={15}
          suffix={<small>{name.length}/15</small>}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            localStorage.setItem("name", e.target.value);
          }}
          className={styles.inputgroup}
          />
        </div>
      </div>
      
      
      <div className={styles.roomCode} style={{display:"inline-flex" ,textAlign:"center" ,justifyContent:"space-evenly"}}>
      <div>

      <p2>Room Code</p2>
      <Input
        placeholder={callId}
        size="large"
        className={styles.inputgroup}
        value={idToCall}
        onChange={(e) => {setIdToCall(e.target.value) } }
        style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
        prefix={<UserOutlined className="site-form-item-icon" />}
        suffix={
          <Tooltip title="Enter code of the other user">
            <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
          </Tooltip>
  }       
/>
  </div>
     
     </div>
     <div className={styles.copyCode} style={{display:"inline-flex" ,textAlign:"center" ,justifyContent:"space-around",flexWrap:"wrap"}}>
     {callAccepted && !callEnded ? (
         
         <Button
           variant="contained"
           onClick={leaveCall}
           className={styles.hang}
           tabIndex="0"
         >
           {/* <img src={Hang} alt="hang up" style={{ height: "15px" }} /> */}
           &nbsp; Leave
         </Button>
       ) : (
         <Button
           type="primary"
           icon={<PhoneOutlined />}
           onClick={() => {
             if (name.length) {callUser(idToCall) ;}
             else message.error("Please enter your name to call!");
           }}
           className={styles.btn}
           tabIndex="0"
         >
           Join
         </Button>
        )} 
      <div>
        
        <CopyToClipboard text={me}>
          <Button
            type="primary"
            icon={<CopyOutlined />}
            className={styles.btn}
            tabIndex="0"
            onClick={(event)=>{
              message.success("Code copied successfully!");
              setCallId(me);}}
          >
            Copy Room code
          </Button>
        </CopyToClipboard>
        </div>
        <div className={styles.share_options}>
         
         <div className={styles.share_social}>
           <WhatsappShareButton
             url={`https://interviewapp-o3fbihuwj-rishuraj2401.vercel.app/`}
             title={`Join this meeting with the given code "${me}"\n`}
             separator="Link: "
             className={styles.share_icon}
           >
             <WhatsappIcon size={26} round />
           </WhatsappShareButton>
           <FacebookShareButton
             url={`https://interviewapp-o3fbihuwj-rishuraj2401.vercel.app/`}
             title={`Join this meeting with the given code "${me}"\n`}
             className={styles.share_icon}
           >
             <FacebookIcon size={26} round />
           </FacebookShareButton>
           <TwitterShareButton
             url={`https://interviewapp-o3fbihuwj-rishuraj2401.vercel.app/`}
             title={`Join this meeting with the given code  "${me}"\n`}
             className={styles.share_icon}
           >
             <TwitterIcon size={26} round className={styles.share_border} />
           </TwitterShareButton>
         </div>
      </div>
      </div>
    </div>
    <div>

{call.isReceivingCall && !callAccepted && (
  <>
    <audio src={Teams} loop ref={Audio} />
    <Modal
      title="Room Invite"
      visible={isModalVisible}
      onOk={() => showModal(false)}
      onCancel={handleCancel}
      footer={null}
      style={{borderRadius: "1rem",}}
    >
      <div style={{ display: "flex", justifyContent: "space-around" ,}}>
        <h1>
          {call.name} is inviting to join Room:{" "}
          {/* <img
            src={Phone}
            alt="phone ringing"
            className={styles.phone}
            style={{ display: "inline-block" }}
          /> */}
        </h1>
      </div>
      <div className={styles.btnDiv}>
        <Button
          variant="contained"
          className={styles.answer}
          color="#29bb89"
          icon={<PhoneOutlined />}
          onClick={() => {
            answerCall();
            Audio.current.pause();
          }}
          tabIndex="0"
        >
          Accept Invite
        </Button>
        <Button
          variant="contained"
          className={styles.decline}
          icon={<PhoneOutlined />}
          onClick={() => {
            setIsModalVisible(false);
            Audio.current.pause();
          }}
          tabIndex="0"
        >
          Decline Invite
        </Button>
      </div>
    </Modal>
  </>
)} 
</div>  
    </>
  );
};

export default Options;
