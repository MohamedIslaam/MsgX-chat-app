import React, { useState, useContext } from 'react';
import './Signup.css';
import { MyCont } from '../../MyProvi';

function Signup() {
    let { api, navi } = useContext(MyCont);
    let [show, setShow] = useState(false);
    let [form, setForm] = useState({
        uname: "",
        phone: "",
        pwd: ""
    });
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let res = await api.post('/signup', form);
            alert("User created")
        } catch (error) {
            alert(error.message);
            console.log(error.message

            )
        }
        setForm({
            uname: "",
            phone: "",
            pwd: ""
        })
    }

    function handleChange(e) {
        let { name, value } = e.target;
        setForm((prev => (
            { ...prev, [name]: value }
        )))
    }

    return (
        <div className="signcont">
            <div className="innercont">
                <div className="contleft">
                    <img src="https://media.istockphoto.com/id/1302474481/vector/team-of-men-programmers-working-on-web-development-brainstorming-process-script-coding.jpg?s=612x612&w=0&k=20&c=iUKYMWvTRe-ygGS0gr_kkiIHsPnxnbR4M6xkhos6Z18=" alt="" />
                </div>
                <div className="contrig">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name">User name:</label>
                            <input type="text" name="uname" value={form.uname} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone number:</label>
                            <input type="text" name="phone" value={form.phone} onChange={handleChange} />
                        </div>
                        <div className="pwd">
                            <label htmlFor="pwd">password:</label>
                            <input type={show ? "test" : "password"} name="pwd" value={form.pwd} onChange={handleChange} />
                            <p onClick={() => setShow(prev => !prev)}>show</p>
                        </div>
                        <div>
                            <p>Already have an account?<a onClick={()=>navi('/login')}>Log in</a></p>
                        </div>
                        <button type="submit">Sign up</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup