import React, { useEffect, useState } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css'
import logo from './Pictures/TECH_SAHAY.png';
import anime from 'animejs';
import axios from 'axios'



function howitworks() {
    AOS.init({
        once: true, // This means animations will only play once
        // disable: 'mobile' // Optionally disable animations on mobile
    });

    // Animation when elements appear on the screen
    useEffect(() => {
        anime({
            targets: 'main',
            opacity: [0, 1],
            easing: 'easeInOutQuad',
            duration: 1000
        });
    }, []);

    function menubtnclick() {
        mobileMenu.classList.toggle('hidden'); // Toggle visibility of mobile menu
    };

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
                    alert(data.status); // This will show "Invalid email or password"
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

    const [error, setError] = useState('');

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
            <div className='bg-blue-100'>
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
                <main className="container mx-auto py-8">
                    <section className="text-center mb-12" data-aos="fade-up" data-aos-duration={1000} data-aos-once="true">
                        <h1 className="text-3xl font-semibold mb-4">How TECHSAHAY Works</h1>
                        <p className="text-gray-700 mb-8">Learn how to donate gadgets and how recipients can receive them.</p>
                    </section>
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
                        <div className="max-w-md w-full md:w-auto bg-white rounded-lg p-8 shadow-md transform transition-all duration-300 hover:shadow-2xl" data-aos="fade-right" data-aos-duration={1000} data-aos-once="true">
                            <h2 className="text-xl font-semibold mb-4">For Donors</h2>
                            <p className="text-gray-700 mb-4">Follow these steps to donate your gadgets:</p>
                            <ul className="list-disc list-inside text-gray-700">
                                <li className="mb-2">Register/Login to your account.</li>
                                <li className="mb-2">Fill in the gadget donation form.</li>
                                <li className="mb-2">Review and submit the form.</li>
                                <li className="mb-2">Follow instructions for data wiping.</li>
                                <li className="mb-2">Choose drop-off or mail-in options.</li>
                                <li className="mb-2">Wait for gadget inspection and refurbishment.</li>
                                <li className="mb-2">Receive digital certificate and thank-you note.</li>
                            </ul>
                            <a href='#' onClick={toggleModal} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 inline-block hover:bg-blue-600">Donate</a>
                        </div>
                        <div className="max-w-md w-full md:w-auto bg-white rounded-lg p-8 shadow-md transform transition-all duration-300 hover:shadow-2xl" data-aos="fade-left" data-aos-duration={1000} data-aos-once="true">
                            <h2 className="text-xl font-semibold mb-4">For Recipients</h2>
                            <p className="text-gray-700 mb-4">Follow these steps to receive gadgets:</p>
                            <ul className="list-disc list-inside text-gray-700">
                                <li className="mb-2">Register/Login to your account.</li>
                                <li className="mb-2">Browse available gadgets.</li>
                                <li className="mb-2">Submit application for desired gadget.</li>
                                <li className="mb-2">Wait for verification and approval.</li>
                                <li className="mb-2">Receive notification and instructions.</li>
                                <li className="mb-2">Choose pick-up or delivery options.</li>
                                <li className="mb-2">Receive the gadget.</li>
                            </ul>
                            <a href="#" onClick={rcshow} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 inline-block hover:bg-blue-600">Request Gadgets</a>
                        </div>
                    </div>
                </main>
                <footer className="bg-blue-600 text-white text-center p-5" data-aos="fade-up" data-aos-duration={1000} data-aos-once="true">
                    <div className="container mx-auto">© 2024 TECHSAHAY. All rights reserved.</div>
                    <p>Connect with us:</p>
                    <div className="flex justify-center mt-2">
                        {/* Social Icons as SVGs */}
                        <a href="#" className="mx-2 hover:text-blue-300 transition duration-300 ease-in-out">Facebook</a>
                        <a href="#" className="mx-2 hover:text-blue-300 transition duration-300 ease-in-out">Twitter</a>
                        <a href="#" className="mx-2 hover:text-blue-300 transition duration-300 ease-in-out">Instagram</a>
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
                                    <input type="submit" defaultValue="Log In" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer" />
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

export default howitworks