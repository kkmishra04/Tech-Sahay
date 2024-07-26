import React, { useState } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from './Pictures/TECH_SAHAY.png';
import homepic from './Pictures/Homw2.jpeg';
import axios from 'axios'

function home() {

    AOS.init({
        once: true, // This means animations will only play once
    });
    // Add click event listener
    function menubtnclick() {
        mobileMenu.classList.toggle('hidden'); // Toggle visibility of mobile menu
    };

    function learnMoreBtn() {
        window.location.href = '/about'
    }

    // Function to show/hide the dtauthmodal
    function toggleModal() {
        const modal = document.getElementById('dtauthModal');
        modal.classList.toggle('hidden');
    }

    function toggleForms() {
        const dtloginForm = document.getElementById('dtloginForm');
        const dtsignupForm = document.getElementById('dtsignupForm');
        dtloginForm.classList.toggle('hidden');
        dtsignupForm.classList.toggle('hidden');
    }

    // Function to show/hide the rcauthmodel
    function rctoggleModal() {
        const rcmodal = document.getElementById('rcauthModal');
        rcmodal.classList.toggle('hidden')
    }

    function rctoggleForms() {
        const rcloginForm = document.getElementById('rcloginForm');
        const rcsignupForm = document.getElementById('rcsignupForm');
        rcloginForm.classList.toggle('hidden');
        rcsignupForm.classList.toggle('hidden');
    }

    function rcshow() {
        rctoggleModal(); // Show the modal with the login form by default
    }

    const [values, setUserData] = useState({
        username: "",
        mobile: "",
        email: "",
        password: ""
    });

    const handleinput = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page
        axios.post('https://techsahay-backend.onrender.com/signup', values)
            .then(response => {
                console.log(response),
                    alert("Account created successfully!"),
                    toggleForms()
            })
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    setError('This email is already in use. Please use another email or login.');
                } else {
                    setError('An error occurred. Please try again later.');
                }
                console.error('Signup error:', error);
            });
    }

    const handleSubmitLogin = (event) => {
        event.preventDefault();
        axios.post('https://techsahay-backend.onrender.com/login', values)
            .then(response => {
                const data = response.data;
                if (data.status === "Success") {
                    console.log('Login Successful: ', data);
                    localStorage.setItem('userId', data.userId); // Store userId in localStorage
                    alert("Login Successful");
                    window.location.href = '/dprofile';
                } else {
                    alert(data); // This will show "Invalid email or password"
                }
            })
    }

    const [rvalues, setrUserData] = useState({
        username: "",
        mobile: "",
        email: "",
        password: "",
        annualIncome: ""
    });

    const [usernameError, setUsernameError] = useState('');
    const handlerinput = (e) => {
        const { name, value } = e.target;
        if (name === "UserName") {
            const regex = /^[A-Za-z]+$/;
            if (value === "" || regex.test(value)) {
                setrUserData(prevState => ({ ...prevState, [name]: value }));
                setUsernameError('');  // Clear error
            } else {
                setUsernameError('Username must contain only letters.');
            }
        } else {
            // For all other fields, update the state normally
            setrUserData(prevState => ({ ...prevState, [name]: value }));
        }
    }

    const handlerSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
    
        // Check if the username has any errors first
        if (usernameError) {
            alert("Please correct the errors in your username.");
            return; // Stop the form submission here
        }
    
        // Proceed only if annual income is less than 2 lakhs
        if (parseInt(rvalues.annualIncome) < 200000) {
            axios.post('https://techsahay-backend.onrender.com/rsignup', rvalues)
                .then(response => {
                    alert("Account created successfully!");
                    // Optional: sendEmailConfirmation();
                    rctoggleForms(); // Toggle between login and signup if necessary
                })
                .catch(error => {
                    if (error.response && error.response.status === 409) {
                        setError('This email is already in use. Please use another email or login.');
                    } else {
                        setError('An error occurred. Please try again later.');
                    }
                    console.error('Signup error:', error);
                });
        } else {
            setError("Your income is more than enough to buy new gadget");
        }
    };

    const [error, setError] = useState('');

    const handlerSubmitLogin = (event) => {
        event.preventDefault();
        axios.post('https://techsahay-backend.onrender.com/rlogin', rvalues)
            .then(response => {
                const data = response.data;
                if (data.status === "Success") {
                    console.log('Login Successful: ', data);
                    localStorage.setItem('userId', data.userId); // Store userId in localStorage
                    alert("Login Successful");
                    window.location.href = '/rhome';
                } else {
                    alert(data); // This will show "Invalid email or password"
                }
            })
    }

    return (
        <React.Fragment>
            <div className='bg-blue-50 text-gray-800 overflow-hidden'>
                <header className="bg-blue-600 text-white" data-aos="fade-down" data-aos-duration={1000}>
                    <div className=" container mx-auto flex justify-between items-center p-5">
                        <a href="/" className=" flex items-center gap-4">
                            <img src={logo} alt="img" className="w-16" />
                            <div className="text-lg font-bold">TECHSAHAY</div>
                        </a>
                        <nav className="hidden md:flex space-x-4">
                            <ul className="flex">
                                <li className="mx-4"><a href="about" className="hover:text-blue-300 transition duration-300 ease-in-out">About Us</a></li>
                                <li className="mx-4"><a href="howitworks" className="hover:text-blue-300 transition duration-300 ease-in-out">How It Works</a></li>
                                <li className="mx-4"><a href="gallery" className="hover:text-blue-300 transition duration-300 ease-in-out">Gallery</a></li>
                                <li className="mx-4"><a onClick={toggleModal} href="#" className="hover:text-blue-300 transition duration-300 ease-in-out">Donate</a></li>
                                <li className="mx-4"><a onClick={rcshow} href='#' className="hover:text-blue-300 transition duration-300 ease-in-out"> Request Gadgets</a></li>
                            </ul>
                        </nav>
                        <button id="menuBtn" className="md:hidden focus:outline-none" onClick={menubtnclick}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                    <div id="mobileMenu" className=" md:hidden hidden">
                        <a href="about" className="block py-2 px-4 hover:bg-blue-700">About Us</a>
                        <a href="howitworks" className="block py-2 px-4 hover:bg-blue-700"> How It Works</a>
                        <a href="gallery" className="block py-2 px-4 hover:bg-blue-700"> Gallery</a>
                        <a onClick={toggleModal} href="#" className="block py-2 px-4 hover:bg-blue-700"> Donate</a>
                        <a onClick={rcshow} href="#" className="block py-2 px-4 hover:bg-blue-700"> Request Gadgets</a>
                    </div>
                </header>
                <section
                    className="hero bg-gradient-to-r from-blue-400 to-blue-500 text-white text-center py-20 relative"
                    data-aos="fade-up"
                    data-aos-duration={1000}

                    id="hero"
                    style={{
                        backgroundImage:
                            `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${homepic})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: "90vh"
                    }}>
                    <h1 className="text-4xl font-bold mb-4 overflow-y-hidden">
                        Empowering Lives, One Gadget at a Time
                    </h1>
                    <p className="mb-8">Join us in making technology accessible to everyone.</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={toggleModal}
                            data-aos="slide-right"
                            data-aos-duration={1000}

                            className="bg-blue-700 hover:bg-blue-800 transition duration-300 ease-in-out text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <svg
                                className="w-6 h-6 mr-2"
                                viewBox="0 0 1024 1024"
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <g
                                    transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
                                    fill="#FFFFFF"
                                    stroke="none"
                                >
                                    <path d="M4950 9692 c-153 -44 -290 -149 -355 -275 -22 -41 -34 -55 -45 -51 -233 98 -466 68 -639 -83 -94 -83 -164 -193 -196 -313 -10 -36 -19 -66 -20 -68 -1 -1 -37 7 -80 18 -218 56 -427 -3 -591 -165 -66 -66 -89 -97 -127 -175 -89 -180 -81 -58 -85 -1450 l-3 -1235 -62 -40 c-34 -22 -91 -70 -127 -106 l-66 -67 -32 130 c-119 483 -392 818 -749 920 -105 30 -315 32 -413 4 -96 -27 -236 -99 -310 -159 -119 -97 -247 -283 -258 -373 l-5 -45 120 -117 c159 -155 220 -250 257 -397 17 -68 36 -277 36 -400 0 -384 254 -977 600 -1400 117 -143 310 -338 450 -456 156 -131 403 -303 593 -412 44 -26 52 -37 121 -178 77 -154 132 -305 162 -444 16 -69 19 -159 23 -681 l6 -601 27 -41 c16 -23 40 -49 55 -59 26 -17 120 -18 1818 -18 2023 0 1829 -9 1882 83 l28 47 6 625 c4 436 9 639 18 670 45 170 135 387 216 520 31 51 49 67 118 109 179 107 232 141 362 235 266 192 538 470 747 761 221 309 373 642 445 975 20 94 26 160 33 360 7 203 12 258 30 320 48 169 136 285 340 451 42 34 45 40 45 85 -1 54 -27 117 -86 204 -159 238 -389 360 -678 360 -245 0 -443 -84 -627 -266 -54 -54 -174 -219 -187 -258 -2 -6 -41 21 -88 60 -46 39 -136 109 -199 156 -63 48 -125 96 -137 108 l-23 21 0 886 c0 873 0 888 -21 962 -12 42 -32 100 -45 130 -32 71 -113 180 -178 237 -63 56 -190 119 -273 135 -81 15 -213 7 -285 -18 l-57 -20 -12 56 c-25 123 -91 242 -180 327 -111 104 -220 146 -379 146 -85 0 -120 -5 -185 -26 -43 -14 -80 -24 -81 -23 -1 1 -11 20 -22 43 -56 111 -172 212 -298 260 -94 35 -240 42 -334 16z m252 -379 c27 -19 54 -51 71 -85 l28 -54 2 -1098 2 -1098 -110 -50 c-60 -27 -159 -72 -218 -99 -59 -27 -112 -49 -117 -49 -6 0 -10 438 -10 1188 l0 1187 24 50 c47 99 122 147 223 142 51 -2 70 -9 105 -34z m-849 -261 c54 -20 117 -76 144 -130 17 -35 18 -88 18 -1161 l0 -1125 -51 -25 c-55 -28 -208 -101 -319 -152 -38 -17 -78 -36 -88 -41 -16 -8 -17 49 -15 1234 l3 1243 22 42 c13 23 40 56 62 74 70 59 137 71 224 41z m1616 -11 c22 -12 51 -36 65 -54 56 -74 54 -41 57 -857 l2 -754 -39 -17 c-21 -9 -120 -54 -219 -99 -99 -45 -186 -84 -192 -87 -10 -4 -13 167 -13 834 0 930 -2 902 65 980 67 79 181 101 274 54z m-2424 -486 c60 -28 108 -79 139 -144 21 -46 21 -52 24 -1096 l2 -1050 -142 -69 c-157 -76 -360 -169 -396 -180 l-22 -8 2 1164 3 1163 22 55 c32 79 77 128 147 161 79 38 148 39 221 4z m3266 -10 c79 -52 112 -96 134 -182 13 -49 15 -171 15 -816 -1 -588 -4 -756 -13 -750 -7 4 -46 32 -87 63 -41 31 -131 98 -200 148 -69 50 -150 112 -181 136 l-57 45 -7 173 c-4 95 -5 362 -3 594 l3 420 30 59 c54 104 132 148 252 142 59 -3 80 -9 114 -32z m-565 -1683 c37 -19 138 -88 579 -395 342 -239 574 -410 617 -454 117 -121 145 -298 71 -455 -54 -114 -51 -111 -686 -429 -320 -161 -636 -320 -702 -354 -66 -34 -205 -106 -310 -160 -104 -54 -332 -172 -505 -264 -517 -271 -481 -255 -582 -259 -130 -6 -184 18 -360 154 -29 23 -85 53 -125 68 -46 18 -104 51 -160 94 -48 37 -176 131 -283 208 -236 170 -697 506 -797 581 -40 30 -85 70 -100 90 -25 32 -28 45 -28 108 0 62 4 77 28 114 47 71 18 57 849 420 240 105 566 249 725 319 158 71 455 203 658 292 204 90 440 194 525 233 258 116 264 118 415 114 109 -3 137 -7 171 -25z m-4565 -460 c211 -55 405 -283 472 -552 8 -36 23 -116 32 -179 42 -288 155 -522 348 -719 136 -138 257 -212 587 -357 224 -99 282 -128 437 -222 383 -230 752 -557 971 -858 28 -38 81 -118 118 -177 38 -60 71 -108 74 -108 3 0 48 37 100 81 130 110 234 185 337 241 77 43 85 46 79 25 -54 -181 -96 -413 -96 -530 0 -47 4 -56 43 -98 23 -25 70 -76 104 -115 l62 -69 1 67 c0 102 27 285 56 384 75 262 229 509 459 739 259 260 535 425 1032 619 49 19 129 50 178 69 360 140 556 307 715 608 67 129 104 247 135 431 14 87 35 188 46 225 42 135 123 267 221 359 70 66 117 96 206 128 119 43 274 32 373 -26 49 -29 139 -105 139 -118 0 -4 -32 -39 -71 -77 -116 -111 -185 -220 -233 -365 -33 -101 -37 -141 -40 -403 -3 -189 -7 -249 -25 -335 -53 -252 -180 -538 -362 -810 -48 -73 -160 -220 -193 -256 -6 -6 -31 -36 -56 -65 -73 -89 -224 -232 -348 -332 -208 -167 -359 -260 -683 -423 -96 -47 -212 -112 -259 -142 -188 -123 -364 -351 -438 -567 -53 -155 -55 -178 -59 -692 l-5 -483 -154 0 -154 0 0 475 c0 523 0 520 -60 545 -41 17 -87 3 -114 -33 -21 -28 -21 -38 -23 -490 0 -254 -2 -470 -2 -479 -1 -17 -17 -18 -186 -18 l-185 0 0 204 c0 202 0 205 -24 233 -21 25 -31 28 -78 27 l-53 -1 0 158 c0 144 -2 160 -21 186 -45 60 -132 51 -166 -17 -16 -31 -18 -73 -18 -412 l0 -377 -179 -3 -180 -3 -3 302 -3 301 -25 27 c-21 22 -31 25 -74 23 -40 -2 -53 -8 -70 -31 -20 -27 -21 -42 -24 -323 l-3 -294 -179 0 -180 0 0 453 c0 261 -4 479 -10 517 -37 228 -145 450 -302 615 -105 112 -213 182 -478 315 -419 209 -601 339 -904 645 -263 266 -428 497 -573 802 -127 268 -173 475 -173 784 0 222 -12 304 -61 428 -41 103 -123 223 -213 312 l-77 76 49 44 c127 114 281 153 443 111z m1721 -3651 c159 -121 239 -240 287 -430 20 -81 21 -108 21 -553 l0 -468 -110 0 -111 0 1 498 c1 466 0 503 -20 599 -24 121 -69 254 -115 341 -18 34 -29 62 -25 62 4 0 36 -22 72 -49z m3364 -13 c-43 -79 -89 -211 -118 -336 -20 -91 -22 -128 -25 -600 l-4 -503 -110 3 -110 3 1 447 c0 435 4 504 35 609 35 121 139 276 239 357 50 41 110 80 124 82 2 0 -13 -28 -32 -62z" />
                                    <path d="M7197 5939 c20 -40 6 -93 -34 -131 -26 -25 -511 -271 -1013 -514 -253 -122 -1703 -843 -1710 -850 -2 -3 35 -44 82 -91 l87 -86 56 2 c59 2 140 28 210 66 46 25 534 279 890 462 132 68 528 268 880 445 352 176 659 333 682 349 52 36 83 98 83 165 0 43 -4 54 -32 81 -31 29 -180 133 -191 133 -3 0 2 -14 10 -31z" />
                                    <path d="M3883 5315 c-129 -28 -220 -101 -248 -199 -13 -45 -14 -63 -5 -97 18 -65 63 -122 131 -168 74 -50 139 -70 244 -78 203 -14 370 73 411 214 14 48 14 58 0 107 -50 171 -296 273 -533 221z m224 -167 c18 -5 46 -22 63 -38 23 -22 30 -36 30 -67 0 -67 -59 -105 -165 -105 -105 0 -195 56 -195 122 0 37 56 87 107 95 21 4 43 8 48 9 14 5 74 -4 112 -16z" />
                                </g>
                            </svg>
                            I Want to Donate
                        </button>
                        <button
                            data-aos="slide-left"
                            data-aos-duration={1000}

                            onClick={rcshow}
                            className="bg-blue-700 hover:bg-blue-800 transition duration-300 ease-in-out text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <svg className="w-7 h-7 mr-2" viewBox="0 0 1024 1024">
                                <g
                                    transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
                                    fill="#FFFFFF"
                                    stroke="none"
                                >
                                    <path d="M5062 9404 c-21 -15 -22 -20 -22 -213 0 -187 1 -199 20 -216 30 -28 84 -25 109 6 19 22 20 38 21 211 0 180 -1 188 -22 208 -26 24 -75 26 -106 4z" />
                                    <path d="M4505 9288 c-30 -17 -44 -40 -45 -69 0 -34 64 -205 86 -230 24 -27 70 -24 99 6 33 32 32 51 -10 170 -45 126 -75 154 -130 123z" />
                                    <path d="M5646 9282 c-18 -21 -86 -204 -86 -233 0 -10 11 -30 23 -45 26 -30 79 -36 104 -11 21 20 83 196 83 235 0 19 -8 40 -20 52 -26 26 -81 26 -104 2z" />
                                    <path d="M3941 9124 c-37 -47 -37 -47 135 -316 14 -22 35 -40 51 -44 54 -14 104 41 90 97 -8 31 -153 259 -175 276 -30 22 -78 16 -101 -13z" />
                                    <path d="M6202 9143 c-20 -8 -192 -272 -192 -294 0 -58 58 -102 106 -81 22 11 145 187 189 272 35 67 -30 132 -103 103z" />
                                    <path d="M3412 8820 c-12 -11 -25 -32 -28 -46 -12 -49 2 -63 269 -266 59 -45 97 -49 132 -13 26 25 32 63 15 95 -6 10 -62 59 -125 107 -201 153 -221 162 -263 123z" />
                                    <path d="M6653 8766 c-208 -158 -218 -167 -221 -213 -3 -34 1 -44 24 -62 46 -36 70 -28 188 64 202 158 206 162 206 205 0 30 -6 43 -26 59 -15 12 -37 21 -49 21 -13 0 -66 -33 -122 -74z" />
                                    <path d="M2338 8530 c-32 -24 -40 -65 -23 -107 30 -72 124 -73 161 -2 44 86 -62 170 -138 109z" />
                                    <path d="M7783 8535 c-24 -17 -39 -71 -28 -104 20 -65 97 -81 147 -31 27 27 30 36 25 73 -4 26 -14 48 -27 59 -27 22 -88 23 -117 3z" />
                                    <path d="M4517 8525 c-67 -18 -141 -69 -181 -123 -70 -97 -66 -20 -66 -1266 0 -1241 -3 -1176 65 -1268 41 -56 106 -96 184 -114 68 -16 1070 -20 1165 -4 120 19 216 93 258 199 l23 56 3 1100 c2 810 0 1115 -8 1155 -25 114 -92 199 -199 249 l-56 26 -570 2 c-447 1 -580 -1 -618 -12z m1198 -259 c14 -14 26 -41 30 -67 3 -24 5 -438 3 -919 l-3 -875 -627 -3 -628 -2 0 916 0 916 29 29 29 29 572 0 571 0 24 -24z m-508 -2037 c95 -59 106 -188 23 -263 -46 -41 -74 -50 -137 -43 -117 13 -179 138 -122 248 15 31 33 46 72 65 60 28 110 26 164 -7z" />
                                    <path d="M4927 7860 c-93 -25 -182 -70 -265 -135 -82 -64 -105 -95 -96 -130 7 -29 39 -55 69 -55 11 0 56 27 100 60 116 87 210 122 348 128 173 7 290 -30 430 -138 37 -27 77 -50 90 -50 31 0 67 39 67 73 0 68 -210 209 -375 252 -85 22 -280 19 -368 -5z" />
                                    <path d="M5040 7610 c-129 -23 -231 -72 -312 -150 -55 -53 -61 -84 -25 -118 34 -32 55 -28 135 28 100 71 165 93 282 93 115 1 175 -19 277 -93 76 -56 100 -61 131 -27 49 52 11 113 -118 192 -105 64 -259 95 -370 75z" />
                                    <path d="M5000 7334 c-66 -24 -129 -71 -147 -110 -16 -32 -16 -36 4 -62 28 -38 56 -39 111 -4 100 64 182 65 294 4 l67 -37 28 21 c43 32 43 74 0 116 -57 57 -119 81 -222 85 -65 2 -102 -1 -135 -13z" />
                                    <path d="M5074 7080 c-11 -4 -33 -22 -47 -40 -21 -25 -27 -42 -27 -82 0 -41 5 -54 29 -78 37 -38 75 -47 125 -29 47 16 86 67 86 113 0 82 -92 146 -166 116z" />
                                    <path d="M5061 6134 c-28 -35 -26 -69 4 -99 33 -33 70 -32 106 4 36 36 36 51 3 90 -34 41 -83 43 -113 5z" />
                                    <path d="M2941 8503 c-11 -10 -24 -32 -27 -49 -10 -50 29 -80 299 -230 270 -150 293 -157 334 -110 29 34 29 68 1 100 -34 37 -523 306 -558 306 -15 0 -37 -8 -49 -17z" />
                                    <path d="M7135 8473 c-44 -25 -156 -88 -250 -140 -197 -110 -215 -124 -215 -169 0 -41 50 -88 84 -78 51 15 535 283 554 307 5 7 12 25 16 40 5 23 1 34 -23 57 -40 41 -69 38 -166 -17z" />
                                    <path d="M1993 7938 c-12 -6 -27 -24 -32 -40 -14 -41 11 -95 48 -106 14 -4 174 -7 354 -7 l329 0 24 28 c29 34 31 76 5 108 l-19 24 -344 2 c-230 1 -350 -2 -365 -9z" />
                                    <path d="M7050 7884 c-140 -36 -263 -73 -272 -81 -25 -23 -24 -87 2 -113 11 -11 33 -20 49 -20 16 0 133 25 260 55 l231 56 232 4 c231 5 232 5 257 29 34 34 33 82 -3 113 -27 23 -30 23 -264 23 l-237 -1 -255 -65z" />
                                    <path d="M8046 7929 c-29 -22 -34 -60 -15 -103 18 -38 56 -49 143 -41 69 7 78 10 97 37 16 22 19 37 15 63 -10 52 -37 65 -132 65 -67 0 -86 -4 -108 -21z" />
                                    <path d="M2942 7920 c-15 -14 -22 -33 -22 -59 0 -55 30 -78 141 -107 384 -101 365 -98 403 -53 32 38 33 60 4 93 -19 21 -64 37 -242 86 -121 33 -229 60 -241 60 -12 0 -31 -9 -43 -20z" />
                                    <path d="M3750 7577 c-23 -11 -25 -20 -30 -96 -7 -101 -16 -111 -107 -111 -50 0 -67 -4 -83 -20 -26 -26 -25 -60 1 -94 18 -23 27 -26 83 -26 89 0 100 -11 104 -104 4 -82 20 -106 67 -106 44 0 58 23 66 104 4 43 13 84 19 92 9 10 33 14 80 14 63 0 70 2 90 27 16 20 20 36 16 58 -9 41 -25 51 -103 58 -37 4 -73 13 -81 20 -7 8 -17 48 -21 90 -4 43 -11 81 -16 86 -18 16 -60 20 -85 8z" />
                                    <path d="M6405 7565 c-21 -20 -25 -34 -25 -88 0 -88 -11 -100 -96 -105 -80 -5 -104 -20 -104 -67 0 -51 34 -75 107 -75 77 0 89 -13 95 -102 4 -76 25 -108 68 -108 14 0 36 9 48 20 18 18 22 32 22 89 0 88 13 101 99 101 53 0 66 4 88 26 20 20 24 31 19 57 -10 51 -28 61 -112 65 -69 4 -76 6 -85 29 -5 13 -9 51 -9 84 0 46 -4 63 -20 79 -27 27 -66 25 -95 -5z" />
                                    <path d="M2046 7409 c-30 -35 -33 -67 -11 -109 46 -89 175 -55 175 47 0 57 -37 93 -95 93 -36 0 -48 -5 -69 -31z" />
                                    <path d="M8045 7414 c-36 -39 -34 -96 4 -135 35 -34 72 -37 118 -9 34 20 51 69 38 109 -20 64 -114 84 -160 35z" />
                                    <path d="M2650 7179 c-103 -13 -200 -67 -295 -163 -111 -112 -161 -214 -180 -367 l-6 -46 -58 -6 c-175 -19 -333 -154 -392 -335 l-22 -67 1 -901 c1 -868 2 -905 22 -1002 25 -126 64 -234 137 -380 103 -209 221 -372 398 -546 130 -128 668 -642 746 -712 84 -76 103 -104 134 -194 39 -115 45 -237 45 -923 l0 -638 26 -26 c25 -25 28 -26 122 -19 54 3 117 6 142 6 l45 0 -6 802 c-6 862 -3 816 -57 956 -56 145 -80 172 -576 667 -501 499 -682 675 -697 675 -12 0 23 -69 51 -97 11 -13 18 -23 14 -23 -4 0 3 -12 17 -27 13 -14 18 -23 11 -19 -17 10 -92 112 -92 126 0 5 -4 10 -9 10 -20 0 -124 195 -166 310 -26 72 -27 85 -32 315 -2 132 -8 263 -12 292 -5 33 -4 50 2 46 27 -17 337 -696 337 -738 0 -25 59 -119 82 -131 65 -34 137 -5 154 62 28 113 -176 650 -367 965 -78 128 -77 124 -37 149 51 31 130 27 193 -9 162 -93 279 -295 434 -743 49 -145 55 -154 94 -178 44 -27 73 -25 105 7 32 32 73 33 200 7 414 -84 796 -373 981 -742 43 -84 88 -224 97 -297 8 -69 44 -115 89 -115 33 0 95 59 95 90 0 24 -29 143 -62 255 -105 357 -487 748 -882 905 -106 42 -279 85 -396 100 l-96 12 -57 171 c-32 95 -85 228 -119 297 l-61 125 7 165 c5 157 24 408 80 1075 34 399 35 405 52 405 37 0 98 -36 125 -73 26 -36 29 -48 29 -116 0 -42 -4 -114 -10 -161 -24 -210 -101 -1102 -101 -1165 0 -79 10 -138 46 -272 48 -176 77 -218 148 -217 33 1 47 8 69 33 30 34 34 57 18 111 -50 168 -53 293 -16 690 48 519 74 772 79 777 11 10 50 -10 88 -44 56 -51 61 -79 44 -278 -8 -93 -24 -315 -36 -493 -22 -315 -22 -324 -4 -400 24 -103 81 -275 111 -333 37 -74 113 -89 165 -33 30 32 29 58 -15 237 -43 177 -44 191 -11 572 14 160 25 293 25 298 0 4 10 1 23 -8 36 -23 64 -84 72 -155 32 -310 117 -566 283 -850 140 -240 204 -322 406 -523 106 -106 208 -214 226 -241 53 -79 116 -214 149 -321 55 -178 61 -236 61 -613 0 -376 6 -321 -74 -692 l-24 -116 -3 -728 -3 -728 23 -19 c26 -21 120 -26 166 -9 55 21 55 18 55 767 l1 688 58 226 57 226 60 -231 59 -231 5 -708 5 -708 25 -19 c19 -15 42 -20 97 -20 124 0 113 -76 113 755 0 752 1 739 -51 952 -55 228 -59 264 -59 599 0 339 11 441 66 614 69 221 137 320 381 565 174 173 199 204 292 344 110 168 218 372 274 521 55 144 82 266 123 557 3 19 20 48 41 70 l36 38 8 -25 c8 -26 43 -396 55 -580 6 -101 5 -111 -35 -263 -22 -87 -41 -172 -41 -188 0 -38 48 -89 84 -89 78 0 110 49 178 270 57 189 60 204 54 275 -3 39 -13 167 -21 285 -9 118 -22 287 -30 375 -27 296 -22 332 56 388 67 48 72 42 90 -119 9 -78 19 -172 22 -210 3 -38 18 -186 32 -329 48 -476 49 -561 5 -723 -27 -97 -26 -144 3 -176 49 -57 126 -35 165 46 41 84 93 288 99 384 5 86 -6 261 -27 434 -5 41 -21 210 -35 375 -14 165 -28 314 -30 330 -12 71 -24 259 -18 286 3 17 20 45 37 64 33 35 110 65 125 49 15 -15 87 -814 131 -1454 l12 -165 -69 -135 c-40 -79 -91 -201 -122 -295 -30 -88 -58 -165 -63 -171 -4 -6 -36 -15 -71 -18 -320 -36 -632 -177 -893 -405 -236 -205 -378 -442 -449 -746 -24 -106 -21 -148 16 -179 17 -14 42 -26 56 -26 35 0 80 49 88 96 49 296 199 547 450 753 204 169 446 278 695 315 l95 14 20 -24 c13 -17 34 -27 62 -31 38 -5 45 -2 81 33 35 34 47 58 88 179 95 283 159 425 247 553 88 128 193 202 284 202 51 0 113 -29 113 -52 0 -8 -16 -36 -35 -65 -69 -103 -220 -403 -282 -563 -79 -204 -113 -330 -113 -421 0 -79 26 -109 95 -109 68 0 91 29 149 185 93 249 267 626 310 672 8 9 10 -59 9 -265 -2 -225 -6 -286 -19 -327 -49 -147 -184 -386 -184 -324 0 24 -110 -80 -621 -591 -606 -604 -618 -618 -680 -815 -32 -98 -38 -275 -39 -998 l0 -688 65 2 c36 1 68 -1 72 -4 10 -10 118 -8 147 3 52 19 51 3 56 780 l5 725 27 80 c15 44 36 93 46 108 11 15 75 80 143 144 632 593 841 803 935 943 138 203 221 372 276 560 46 162 48 195 48 1090 0 542 -4 868 -11 910 -21 130 -107 261 -218 331 -55 36 -159 69 -212 69 l-39 0 0 48 c0 123 -60 252 -170 363 -59 60 -94 85 -163 120 -82 40 -96 43 -180 47 -82 3 -97 1 -137 -20 -56 -29 -90 -90 -90 -159 l0 -46 -47 -7 c-67 -9 -164 -57 -213 -106 -51 -51 -95 -145 -105 -220 l-7 -56 -57 -11 c-32 -6 -75 -19 -95 -28 -65 -31 -143 -111 -178 -182 -28 -58 -33 -79 -36 -164 l-4 -97 -42 -6 c-59 -9 -136 -48 -173 -87 -49 -52 -79 -124 -102 -244 -77 -392 -169 -613 -408 -977 -69 -106 -108 -151 -229 -270 -80 -79 -175 -181 -210 -228 -123 -162 -239 -435 -280 -660 l-18 -95 -12 75 c-39 227 -153 506 -275 670 -34 47 -128 148 -207 225 -128 125 -156 158 -252 302 -59 89 -141 228 -183 310 -107 211 -143 319 -206 622 -33 159 -65 235 -120 283 -43 38 -105 66 -164 74 l-45 6 0 87 c0 118 -33 198 -117 285 -44 44 -139 92 -201 102 -42 6 -43 7 -49 53 -25 182 -147 309 -325 337 -37 6 -40 9 -40 38 0 79 -41 150 -102 179 -47 21 -94 26 -168 16z m5045 -321 c30 -27 66 -69 79 -91 46 -79 49 -127 41 -780 l-8 -608 -38 -19 c-21 -11 -40 -20 -42 -20 -2 0 -7 51 -11 113 -4 61 -16 222 -26 357 -11 135 -33 424 -49 643 -28 373 -31 401 -54 441 l-24 43 38 -15 c21 -8 63 -37 94 -64z m-5039 53 c-24 -26 -25 -38 -77 -726 -17 -230 -38 -476 -65 -777 -3 -38 -8 -68 -10 -68 -2 0 -20 10 -39 23 l-35 22 -2 330 c-1 182 -2 474 -2 650 l-1 320 26 56 c35 74 89 132 152 163 61 31 76 33 53 7z m-478 -998 l-3 -478 -55 -8 c-30 -4 -73 -16 -94 -27 -22 -11 -41 -18 -42 -17 -3 2 -6 707 -5 834 1 52 5 67 28 94 29 34 114 79 151 79 l22 0 -2 -477z m5947 463 c49 -21 104 -65 120 -97 12 -22 15 -105 15 -457 0 -236 -3 -432 -6 -435 -3 -3 -25 3 -48 14 -24 10 -68 22 -97 27 l-54 7 -3 478 c-2 474 -2 477 18 477 11 0 36 -7 55 -14z m178 -1444 c-3 -12 -9 -22 -14 -22 -5 0 -3 11 3 25 13 30 20 28 11 -3z" />
                                    <path d="M4515 5391 c-90 -26 -102 -133 -20 -177 39 -21 76 -14 111 21 29 30 33 92 7 124 -21 24 -69 40 -98 32z" />
                                    <path d="M5648 5384 c-35 -18 -48 -43 -48 -89 0 -44 45 -95 84 -95 57 0 106 46 106 100 0 34 -31 79 -63 90 -38 13 -46 12 -79 -6z" />
                                    <path d="M5080 5277 c-41 -21 -52 -53 -46 -142 6 -87 -4 -149 -27 -172 -8 -8 -42 -17 -75 -20 -70 -7 -95 -26 -95 -75 0 -46 32 -68 103 -68 80 0 92 -16 100 -126 6 -103 21 -121 95 -115 39 4 55 38 55 116 0 101 19 125 99 125 89 0 129 45 97 109 -14 25 -21 29 -82 34 -41 4 -74 13 -83 22 -12 12 -17 47 -21 145 -5 112 -8 133 -25 149 -27 27 -65 34 -95 18z" />
                                </g>
                            </svg>
                            I Need a Gadget
                        </button>
                    </div>
                </section>
                <section
                    id="about"
                    className="container mx-auto text-center py-10"
                    data-aos="fade-up"
                    data-aos-anchor-placement="top-bottom"
                    data-aos-duration={1000}

                >
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">About TECHSAHAY</h2>
                    <p className="max-w-2xl mx-auto">
                        Empowering individuals and communities through technology donation and
                        recycling. Discover how you can contribute to our cause and make a
                        difference.
                    </p>
                    <button
                        id="learnMoreBtn"
                        className="mt-4 bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out text-white font-bold py-2 px-4 rounded" onClick={learnMoreBtn}
                    >
                        Learn More
                    </button>
                </section>
                <footer className="bg-blue-600 text-white text-center p-5" data-aos="fade-up" data-aos-duration={1000} data-aos-anchor="#hero" data-aos-anchor-placement="center-center">
                    <div className="container mx-auto">© 2024 TECHSAHAY. All rights reserved.</div>
                    <p>Connect with us:</p>
                    <div className="flex justify-center mt-2">
                        {/* Social Icons as SVGs */}
                        <a href="#" className="mx-2 hover:text-blue-300 transition duration-300 ease-in-out"> Facebook </a>
                        <a href="#" className="mx-2 hover:text-blue-300 transition duration-300 ease-in-out" > Twitter </a>
                        <a href="#" className="mx-2 hover:text-blue-300 transition duration-300 ease-in-out" > Instagram </a>
                    </div>
                </footer>
                {/* Modal */}
                <div id="dtauthModal" className="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    {/* Modal content */}
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-4 text-center">
                            {/* Login Form */}
                            <div id="dtloginForm">
                                <h2 className="text-lg font-semibold text-blue-600 mb-4">Login</h2>
                                <form className="space-y-4" onSubmit={handleSubmitLogin}>
                                    <input type="email" placeholder="Email" name='Email' onChange={handleinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    <input type="password" placeholder="Password" name='Password' onChange={handleinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    <input type="submit" defaultValue="Log In" onChange={handleinput} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer" />
                                </form>
                                <p className="mt-4">Not a member?{" "}<span className="text-blue-600 cursor-pointer" onClick={toggleForms}>Sign-Up</span></p>
                            </div>
                            {/* Signup Form (Initially Hidden) */}
                            <div id="dtsignupForm" className="hidden">
                                <h2 className="text-lg font-semibold text-blue-600 mb-4">Sign Up</h2>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <input type="text" placeholder="Username" name='UserName' onChange={handleinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    <input type="tel" placeholder="Mobile Number" name='Mobile' onChange={handleinput} pattern="[0-9]{10}" title="Mobile number should be 10 digits" required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                    <input type="email" placeholder="Email" name='Email' onChange={handleinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    <input type="password" placeholder="Password" name='Password' onChange={handleinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    <input type="submit" defaultValue="Sign Up" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer" />
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                </form>
                                <p className="mt-4"> Already a member?{" "} <span className="text-blue-600 cursor-pointer" onClick={toggleForms} > Log In </span>
                                </p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={toggleModal} className="text-gray-400 hover:text-gray-500" > <span className="text-2xl">×</span></button>
                        </div>
                    </div>
                </div>
                {/* rcModal */}
                <div id="rcauthModal" className="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    {/* Modal content */}
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-4 text-center">
                            {/* Login Form */}
                            <div id="rcloginForm">
                                <h2 className="text-lg font-semibold text-blue-600 mb-4">Login</h2>
                                <form className="space-y-4" onSubmit={handlerSubmitLogin}>
                                    <input type="email" placeholder="Email" name='Email' onChange={handlerinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    <input type="password" placeholder="Password" name='Password' onChange={handlerinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    <input type="submit" defaultValue="Log In" onChange={handlerinput} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer" />
                                </form>
                                <p className="mt-4"> Not a member?{" "} <span className="text-blue-600 cursor-pointer" onClick={rctoggleForms} > Sign-Up</span></p>
                            </div>
                            {/* Signup Form (Initially Hidden) */}
                            <div id="rcsignupForm" className="hidden">
                                <h2 className="text-lg font-semibold text-blue-600 mb-4">Sign Up</h2>
                                <form className="space-y-4" onSubmit={handlerSubmit}>
                                    <input type="text" placeholder="Username" name='UserName' onChange={handlerinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    {usernameError && <p className="text-red-500">{usernameError}</p>}
                                    <input type="text" placeholder="Annual Income" name="annualIncome" onChange={handlerinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    <input type="tel" placeholder="Mobile Number" name='Mobile' onChange={handlerinput} pattern="[0-9]{10}" title="Mobile number should be 10 digits" required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                    <input type="email" placeholder="Email" name='Email' onChange={handlerinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    <input type="password" placeholder="Password" name='Password' onChange={handlerinput} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                                    <input type="submit" defaultValue="Sign Up" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer" />
                                    <p>Note : Please send your income certificate to  our email for account verification.</p>
                                    <p>Email us at: <a href="mailto:techsahay5@gmail.com" className='text-blue-700'>techsahay5@gmail.com</a></p>
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                </form>
                                <p className="mt-4">Already a member?{" "} <span className="text-blue-600 cursor-pointer" onClick={rctoggleForms} > Log In </span></p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={rctoggleModal} className="text-gray-400 hover:text-gray-500" > <span className="text-2xl">×</span></button>
                        </div>
                    </div>
                </div>
            </div>


        </React.Fragment>
    )
}

export default home