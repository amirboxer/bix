// resct tools
import { useEffect, useState, useRef } from 'react'

// services
import { utilService } from '../services/util.service.js'

export function BringThemHome() {
    //states
    const [timeSinceOct7, setTimeSinceOct7] = useState(Math.floor((Date.now() - Date.parse('06 Oct 2023 04:26:00 GMT')) / 1000 + 360));
    const [showComponent, setShowComponent] = useState(true);

    //references
    const intervalID = useRef(null);

    // use effects
    useEffect(() => {
        intervalID.current = setInterval(() => setTimeSinceOct7(prev => prev + 1), 1000);
        return () => clearInterval(intervalID.current);
    }, [])

    // functions
    function stringifyTimeSince() {
        let minutes = (timeSinceOct7 - timeSinceOct7 % 60);
        let hours = (timeSinceOct7 - timeSinceOct7 % 3600);
        let days = (timeSinceOct7 - timeSinceOct7 % (3600 * 24));
        let seconds = utilService.padNumWithZero(timeSinceOct7 - minutes);
        minutes = utilService.padNumWithZero((minutes - hours) / 60);
        hours = utilService.padNumWithZero((hours - days) / 3600);
        days = utilService.padNumWithZero(days / (3600 * 24));
        return { days, hours, minutes, seconds };
    }


    const { days, hours, minutes, seconds } = stringifyTimeSince();

    // jsx
    return showComponent && <div className='bring-them-back' lang='he'>
        <a target="_blank" href="https://stories.bringthemhomenow.net/?utm_source=toysrus.co.il&amp;utm_medium=banner">

            {/* close button */}
            <div className="close-btn" role="button" tabIndex="0"
                onClick={e => {
                    e.preventDefault();
                    setShowComponent(prev => !prev);
                }}>X</div>

            {/*  */}
            <div className="subtitle">מאות <span className="red-bg">חטופים</span> על ידי החמאס</div>

            {/* running clock */}
            <div className="time-blocks">

                {/* days */}
                <div className="time-block">
                    <div className='digits'>
                        {days.split('').map((num, idx) => <span className="digit" key={idx}>{num}</span>)}
                    </div>
                    <span className="dots">:</span>
                    <span className="time-desc">ימים</span>
                </div>

                {/* hours */}
                <div className="time-block">
                    <div className='digits'>
                        {hours.split('').map((num, idx) => <span className='digit' key={idx}>{num}</span>)}
                    </div>
                    <span className="dots">:</span>
                    <span className="time-desc">שעות</span>
                </div>

                {/* minutes */}
                <div className="time-block">
                    <div className='digits'>
                        {minutes.split('').map((num, idx) => <span className="digit" key={idx}>{num}</span>)}
                    </div>
                    <span className="dots">:</span>
                    <span className="time-desc">דקות</span>
                </div>

                {/* seconds */}
                <div className="time-block">
                    <div className='digits'>
                        {seconds.split('').map((num, idx) => <span className="digit" key={idx}>{num}</span>)}
                    </div>
                    <span className="time-desc">שניות</span>
                </div>
            </div>

            <div aria-label='מחזירים אותם הביתה עכשיו' className="title-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="153" height="22" viewBox="0 0 153 22" fill="none">
                    <path d="M146.933 15.203L147.857 2.33425H146.915V0.703003H150.177C151.99 0.703003 152.969 1.718 152.969 3.72988V15.203H150.014V13.5718H151.21V3.65738C151.21 2.75113 150.866 2.33425 150.177 2.33425H149.452L148.691 15.203H146.933Z" fill="white"></path>
                    <path d="M139.657 15.203V0.703003H142.449C144.261 0.703003 145.258 1.718 145.258 3.72988V15.203H143.5V3.65738C143.5 2.75113 143.156 2.33425 142.449 2.33425H141.416V15.203H139.657Z" fill="white"></path>
                    <path d="M135.573 15.203V10.5086L134.739 2.33425H133.851V0.703003H138.074V2.33425H136.425L137.331 10.6355V15.203H135.573Z" fill="white"></path>
                    <path d="M130.602 10.1099V2.33425H129.497V0.703003H132.361V10.1099H130.602Z" fill="white"></path>
                    <path d="M126.215 3.65738C126.215 2.75113 125.871 2.33425 125.164 2.33425H122.935V0.703003H125.164C126.977 0.703003 127.974 1.718 127.974 3.72988V15.203H126.215V3.65738Z" fill="white"></path>
                    <path d="M119.686 10.1099V2.33425H118.581V0.703003H121.444V10.1099H119.686Z" fill="white"></path>
                    <path d="M111.235 15.203V0.703003H116.835V15.203H111.235ZM112.993 13.6624H115.077V2.24363H112.993V13.6624Z" fill="white"></path>
                    <path d="M100.461 9.9105C100.515 7.91675 101.023 6.82925 101.983 6.32175L100.008 0.974878V0.703003H101.748L103.85 6.99238H104.194L104.575 0.703003H106.261L105.644 8.26113L104.303 8.27925L106.75 14.8586V15.203H105.046L102.509 7.71738C102.128 7.98925 102.056 8.49675 102.038 9.22175L101.983 15.203H100.261L100.461 9.9105Z" fill="white"></path>
                    <path d="M96.6873 15.203V2.33425H95.5273V0.703003H98.4455V15.203H96.6873Z" fill="white"></path>
                    <path d="M87.1975 15.203V13.5718H88.3938V2.33425H87.4694V0.703003H91.185C92.9975 0.703003 93.9944 1.718 93.9944 3.72988V15.203H92.2363V3.65738C92.2363 2.75113 91.8919 2.33425 91.185 2.33425H90.1519V15.203H87.1975Z" fill="white"></path>
                    <path d="M80.0327 15.203V0.703003H85.6333V15.203H80.0327ZM81.7908 13.6624H83.8752V2.24363H81.7908V13.6624Z" fill="white"></path>
                    <path d="M73.2595 15.203V2.33425H69.2539V0.703003H75.0177V15.203H73.2595ZM69.5439 15.203V5.10738H71.302V15.203H69.5439Z" fill="white"></path>
                    <path d="M62.5708 15.203V13.5718H65.3439V2.33425H62.5708V0.703003H67.1021V13.5718H67.8633V15.203H62.5708Z" fill="white"></path>
                    <path d="M59.141 10.1099V2.33425H58.0354V0.703003H60.8992V10.1099H59.141Z" fill="white"></path>
                    <path d="M49.7056 15.203V13.5718H50.9018V2.33425H49.9774V0.703003H53.6931C55.5056 0.703003 56.5024 1.718 56.5024 3.72988V15.203H54.7443V3.65738C54.7443 2.75113 54.3999 2.33425 53.6931 2.33425H52.6599V15.203H49.7056Z" fill="white"></path>
                    <path d="M46.3652 15.203V2.33425H42.3596V0.703003H48.1234V15.203H46.3652ZM42.6496 15.203V5.10738H44.4077V15.203H42.6496Z" fill="white"></path>
                    <path d="M31.5835 15.203V13.5718H32.6891L31.7466 0.703003H33.5047L34.3204 13.5718H34.8279C35.5166 13.5718 35.861 13.1549 35.861 12.2486V0.703003H37.6191V12.158C37.6191 14.1699 36.6404 15.203 34.8279 15.203H31.5835Z" fill="#E82900"></path>
                    <path d="M25.3277 15.203V13.5718H27.1221C27.8108 13.5718 28.1552 13.1549 28.1552 12.2486V2.33425H25.3096V0.703003H29.9133V12.158C29.9133 14.1699 28.9346 15.203 27.1221 15.203H25.3277Z" fill="#E82900"></path>
                    <path d="M16.3141 15.203L15.5166 0.703003H17.2022L17.601 9.4755H18.761V0.703003H20.4104V10.9799H17.6735L17.8004 13.5718H20.8997C21.6066 13.5718 21.951 13.1549 21.951 12.2486V0.703003H23.7091V12.158C23.7091 14.1699 22.7122 15.203 20.8997 15.203H16.3141Z" fill="#E82900"></path>
                    <path d="M11.996 10.1099V2.33425H10.8904V0.703003H13.7541V10.1099H11.996Z" fill="#E82900"></path>
                    <path d="M7.389 15.203V2.33425H6.229V0.703003H9.14713V15.203H7.389Z" fill="#E82900"></path>
                    <path d="M152.723 18.4261L152.736 18.5444H152.742L152.743 18.5671H152.738L152.751 18.6839H152.691L152.678 18.5686L144.581 18.79C144.581 18.7475 144.581 18.7066 144.581 18.6642L145.183 18.6475L152.678 18.5459L152.665 18.4291H152.725L152.723 18.4261ZM9.7814 21.1434L15.9484 21.2177L19.0318 21.2541L22.1153 21.2799L28.2824 21.33L34.4493 21.3633C38.5606 21.3906 42.6719 21.3921 46.7814 21.4088C50.8927 21.4134 55.0021 21.4194 59.1135 21.4255H66.9572L74.8028 21.4118L76.7647 21.4088L78.7247 21.3997L82.6466 21.383L86.5685 21.3648L90.4904 21.336C100.949 21.2617 111.409 21.1404 121.86 20.9357C124.842 20.8781 127.822 20.8144 130.803 20.7477C138.164 20.684 145.526 20.596 152.884 20.4853L152.85 20.1669C152.89 20.1669 152.929 20.1639 152.969 20.1639L152.623 16.9506C152.584 16.9506 152.545 16.9506 152.505 16.9521L152.471 16.6337C143.063 16.9082 133.65 17.1265 124.234 17.2933C123.42 17.2994 122.606 17.307 121.792 17.313C90.3497 17.5223 58.8902 17.2569 27.4795 16.5094C26.5755 16.4881 25.6696 16.473 24.7656 16.4563L22.0497 16.4123C20.2379 16.3865 18.4279 16.3607 16.6161 16.3365L16.7437 16.6458C20.7049 16.7975 24.6755 16.9279 28.6518 17.0173C30.6399 17.0628 32.628 17.1098 34.6199 17.1432C36.6099 17.1751 38.6 17.2069 40.5919 17.2372C48.5576 17.3449 56.5251 17.4131 64.4777 17.5208L67.4862 17.5663L70.4945 17.6042L76.5115 17.6815C78.1451 17.6982 79.7807 17.7179 81.4143 17.7361C74.1539 17.7695 66.8915 17.7862 59.6311 17.7786C59.3028 17.774 58.9746 17.7725 58.6464 17.768L58.6426 17.7786C41.1226 17.7573 23.6045 17.6163 6.08643 17.354C2.4684 17.2994 1.11987 17.4298 1.0561 17.8589C0.922935 18.7688 0.335865 19.671 0.298353 20.5824C0.292726 20.7158 2.1158 20.963 3.38558 21.0267C5.3906 21.1252 7.63947 21.1116 9.78516 21.145" fill="#E82900"></path>
                </svg>
            </div>
        </a>
    </div >
}