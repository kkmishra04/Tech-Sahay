import React, { useState } from 'react';
import './CSSFile/Dlogin.css';
import axios from 'axios';

function Dlogin() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://techsahay-backend.onrender.com/dlogin', { id, password });
            console.log(response.data);
            alert('Login successful');
            window.location.href='/dlist'
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data.message : "Server not responding");
            alert('Login failed: ' + (error.response ? error.response.data.message : "Server not responding"));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#edf2f7' }}>
            <div className="max-w-sm w-full p-6 m-auto bg-white rounded-lg border border-gray-200 shadow-md">
                <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">Delivery Partner Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900">ID:</label>
                        <input type="text" id="id" name="id" value={id} onChange={e => setId(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Your ID" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password:</label>
                        <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Password" />
                    </div>
                    <button type="submit" className="btn w-full text-white bg-purple-600 hover:bg-purple-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Dlogin;
