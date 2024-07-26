import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './Pictures/TECH_SAHAY.png';

function Profile() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.post('https://techsahay-backend.onrender.com/rp', { userId });
            const data = response.data;
            setUserData({
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // useEffect to trigger the fetch operation on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading profile: {error}</p>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({ ...prevState, [name]: value }));
    };

    function toggleEdit() {
        const isEditable = document.getElementById('nameInput').classList.contains('hidden');
        document.querySelectorAll('.form p, .form input, .form textarea, #saveButton').forEach(element => {
            if (element.tagName === 'P') {
                element.classList.toggle('hidden', isEditable);
            } else {
                element.classList.toggle('hidden', !isEditable);
            }
        });
    }

    function saveProfile() {
        // Here, you'd make a request to your backend to save the updated profile information
        const updatedUserData = {
            id: localStorage.getItem('userId'),
            UserName: document.getElementById('nameInput').value,
            Email: document.getElementById('emailInput').value,
            Mobile: document.getElementById('phoneInput').value,
            Address: document.getElementById('addressInput').value,
        };

        axios.put('https://techsahay-backend.onrender.com/update-rprofile', updatedUserData)
            .then(response => {
                // On success, update the local state to reflect the new user data
                setUserData(updatedUserData);
                // Optionally, switch back to non-edit mode and show success message
                toggleEdit();
                alert('Profile updated successfully!');
                fetchUserData()
            })
            .catch(error => {
                console.error('Failed to update profile:', error);
                alert('Error updating profile: ' + error.message);
            });
    }


    function navigateToReceivedGadgets() {
        // Implement the logic to navigate to the Received Gadgets page
        console.log("Navigating to Received Gadgets...");
        window.location.href = "/rpage"
    }

    function logout() {
        // Implement the logic for logout
        window.location.href= "/"
    }

    const redirectToProfile = () => {
        console.log("Redirecting to Recipient Profile...");
        window.location.href='/rprofile'
        // Implement actual redirection
    };

    return (
        <React.Fragment>
            <div style={{ backgroundColor: '#edf2f7' }}>
                <nav className="bg-blue-600 p-5 text-white font-semibold text-lg">
                    <div className="container mx-auto flex justify-between items-center">
                        <a href="/rhome" className=" flex items-center gap-4">
                            <img src={logo} alt="img" className="w-16" />
                            <div className="text-lg font-bold">TECHSAHAY</div>
                        </a>
                        <button onClick={redirectToProfile} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition duration-300 ease-in-out transform hover:-translate-y-1">Profile</button>
                    </div>
                </nav>
                <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
                        <div className="flex flex-col">
                            <div className="flex flex-col sm:flex-row items-center mb-5">
                                <h2 className="text-2xl font-extrabold text-gray-900 sm:mr-auto">Recipient Profile</h2>
                                <button onClick={toggleEdit} className="text-white bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded-lg sm:ml-4 sm:w-auto w-full mt-4 sm:mt-0">Edit
                                    Profile</button>
                            </div>
                            <div className="form">
                                {/* Profile Information Display */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                    <p id="nameText" className="py-2">{userData.name}</p>
                                    <input id="nameInput" type="text" onChange={handleChange} defaultValue={userData.name} className="hidden appearance-none w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                    <p id="emailText" className="py-2">{userData.email}</p>
                                    <input id="emailInput" type="email" onChange={handleChange} defaultValue={userData.email} className="hidden appearance-none w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                                    <p id="phoneText" className="py-2">{userData.phone}</p>
                                    <input id="phoneInput" type="tel" onChange={handleChange} defaultValue={userData.phone} className="hidden appearance-none w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                                    <p id="addressText" className="py-2">{userData.address}</p>
                                    <textarea id="addressInput" onChange={handleChange} className="hidden appearance-none w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" defaultValue={userData.address} />
                                </div>
                                <button onClick={saveProfile} className="hidden text-white bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded-lg mb-4" id="saveButton">Save Profile</button>
                                <button onClick={navigateToReceivedGadgets} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mb-3 w-full button">Received Gadgets</button>
                                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-full button">Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Profile;
