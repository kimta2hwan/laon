import './styles/Match.css'
import { useSelector } from 'react-redux';

import Field from './img/field.png'
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';


export default function Match() {
  const awayTeamLogo = useSelector((state) => state.awayTeamLogo)
  const homeTeamLogo = useSelector((state) => state.homeTeamLogo)
  const inningData = useSelector((state) => state.inning)
  const awayScore = useSelector((state) => state.awayScore )
  const homeScore = useSelector((state) => state.homeScore)
  let liveText = useSelector((state) => state.liveText)
  const ballCount = useSelector((state) => state.ballCount)
  const strikeCount = useSelector((state) => state.strikeCount)
  const outCount = useSelector((state) => state.outCount)

  const base1 = useSelector((state) => state.base1)
  const base2 = useSelector((state) => state.base2)
  const base3 = useSelector((state) => state.base3)

  const stZoneRef = useRef(null);
  const stZoneRectRef = useRef(null);
  const nowBallcount = 1;
  const pitchResult = 'S';

  // 
  const crossPlateX = -0.347363
  const crossPlateY = 1.4167
  const topSz = 3.48983
  const bottomSz = 1.5
  const vy0 = -130.945
  const vz0 = -4.46333
  const vx0 = 3.86331
  const z0 = 5.64619
  const y0 = 50.0
  const x0 = -0.979984
  const ax = -11.5091
  const ay = 29.6069
  const az = -13.4183


  const t = (-vy0 - (vy0 * vy0 - 2 * ay * (y0 - crossPlateY)) ** 0.5) / ay

  const t40 = (-vy0 - (vy0 * vy0 - 2 * ay * (y0 - 40)) ** 0.5) / ay
  const x40 = x0 + vx0 * t40 + 0.5 * ax * t40 * t40
  const vx40 = vx0 + ax * t40
  const z40 = z0 + vz0 * t40 + 0.5 * az * t40 * t40
  const vz40 = vz0 + az * t40
  const th = t - t40
  const x_no_air = x40 + vx40 * th
  const z_no_air = z40 + vz40 * th - 0.5 * 32.174 * th * th
  const z_no_induced = z0 + vz0 * t

  const px = x0 + vx0 * t + ax * t * t * 0.5
  const pz = z0 + vz0 * t + az * t * t * 0.5

  const pfx_x = (px - x_no_air) * 12
  const pfx_z = (pz - z_no_air) * 12
  const pfx_x_raw = px * 12


  
  // 출루정보
  let inning = null //이닝
  let homeAttack = false;  // 홈 공격 여부
  let awayAttack = false;  // 어웨이 공격 여부

  if (inningData === "BEFORE"){
    inning = "경기 예정" // 이닝
    liveText = "경기 예정"
  } else if (inningData === 'END') { 
    inning = "경기 종료"
    liveText = "경기 종료"
  } else if (inningData === null) {
    console.log('로딩 중..')
  } else if (inningData[0] === "B"){
    inning = inningData[2] + "회말" // 이닝
    homeAttack = true;
  } else if (inningData[0] === 'T'){
    inning = inningData[2] + "회초" // 이닝
    awayAttack = true;
  } else if (inningData === null){
    inning = "경기종료" // 이닝
  } else {
    console.log("end")
  }

  // 볼카운트
  const divCount = function(payload) {
    const result = []
    for (let i = 0; i < payload; i++) {
      result.push(<div className='bso-circle' key={i}></div>)      
    }
    return result
  }

  useEffect(() => {
    const strikeCanvas = stZoneRef.current;
    strikeCanvas.width = 110;
    strikeCanvas.height = 130;
    const stZoneBallCtx = strikeCanvas.getContext("2d");

    const strikeRectCanvas = stZoneRectRef.current;
    strikeRectCanvas.width = 110;
    strikeRectCanvas.height = 130;
    const stZoneRectCtx = strikeRectCanvas.getContext("2d");
    // console.log(px, pz);

    function drawBall() {
      stZoneBallCtx.beginPath();
      // 4
      stZoneBallCtx.moveTo(60-px*33, 150-pz*33);
      stZoneBallCtx.arc(60-px*33, 150-pz*33, 8, 0, 2 * Math.PI);

      stZoneBallCtx.stroke();
      if(pitchResult === 'S'){
        stZoneBallCtx.fillStyle = 'yellow';
      } else {
        stZoneBallCtx.fillStyle = 'green';
      }
      stZoneBallCtx.fill();
      
      stZoneRectCtx.beginPath();
      stZoneRectCtx.moveTo(24, 24);
      stZoneRectCtx.strokeStyle = "white";
      stZoneRectCtx.strokeRect(27, 32, 56, 66);
      stZoneRectCtx.stroke();
      // stZoneRectCtx.fill();
    }

    drawBall();
  })

  return (
    <div className='match-container font'>

      <div className='match-body'>

        <div className='match-score-board'>
          <div className='match-away-team-container'>
            <img className='match-away-team' src={awayTeamLogo} alt="" />
            <div className='match-away-info'>
              <h3>AWAY</h3>
              <div className={ awayAttack ? 'match-attack-circle' : 'match-non-attack-circle' }></div>
            </div>
          </div>
          
          <div className='score-board-center'>
            <div className='score-board-inning'>
              {inning}
            </div>
            <br />
            <div className='score-board-point'>
              {awayScore ? awayScore : 0} : {homeScore ? homeScore : 0}
            </div>
          </div>
          
          <div className='match-home-team-container'>
            <img className='match-home-team' src={homeTeamLogo} alt="" />
            <div className='match-home-info'>
              <div className={ homeAttack ? 'match-attack-circle' : 'match-non-attack-circle' }></div>
              <h3>HOME</h3>
            </div>
          </div>
        </div>

          
        <div className='liveText'>
          <span>{liveText}</span>
        </div>

        <div className='match-live-info'>
          <div className='match-ball-count'>

            <div className='bso-container'>
              
              <div className='bso-text-container'>
                <span>B</span>
                <span>S</span>
                <span>O</span>
              </div>

              <div className='bso-circle-container'>

                <div  className='ball-circle-container'>
                  {divCount(ballCount)}
                </div>

                <div className='strike-circle-container'>
                  {divCount(strikeCount)}
                </div>

                <div className='out-circle-container'>
                  {divCount(outCount)}
                </div>

              </div>

              
            </div>

          </div>
          <div className='strike-zone-container'>
            {/* <span>스트라이크 존</span> */}
            <canvas className='strikezone-canvas' ref={stZoneRef}></canvas>
            <canvas className='strikezone-text-canvas' ref={stZoneRectRef}></canvas>
          </div>
        </div>

        <div className='match-field'>
          <div className={base1 ? 'base1t' : 'base1'}>
          </div>
          <div className={base2 ? 'base2t' : 'base2'}>
          </div>
          <div className={base3 ? 'base3t' : 'base3'}>
            <span>
            </span>
          </div>
          <img className='match-field-img' src={Field} alt="" />
        </div>

      </div>
    </div>
  )
}
