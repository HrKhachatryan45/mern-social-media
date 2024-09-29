import React, {useState} from 'react';
import {useAuthContext} from "../../context/useAuthContext";
import {TbLogout2} from "react-icons/tb";
import useLogout from "../../hooks/useLogout";
import {HiOutlinePencilSquare} from "react-icons/hi2";
import {IoClose} from "react-icons/io5";
import useUpdateInfo from "../../hooks/useUpdateInfo";
import {FaKey} from "react-icons/fa";
import useChangePassword from "../../hooks/useChangePassword";
import useListenProfile from "../../hooks/useListenProfile";

function ProfileInfo(props) {
    const {authUser} = useAuthContext()
    useListenProfile()
    const {logout,loading} = useLogout()

    const handleLogout =async () =>{
        await logout()
    }
    const [currentPassword,setCurrentPassword] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [confirmNewPassword,setConfirmNewPassword] = useState('')
    const [open,setOpen] = useState(false)
    const [visible,setVisible]=useState(false);
    const [username,setUsername] = useState(authUser.username?authUser.username:'')
    const [email,setEmail] = useState(authUser.email?authUser.email:'')
    const [profileImage,setProfileImage] = useState('')
    const [blobProfile,setBlobProfile] = useState(null)
    const [backgroundImage,setBackgroundImage] = useState('')
    const [blobBackground,setBlobBackground] = useState(null)
    const [fullName,setFullName] = useState(authUser.fullName)
    const [profession,setProfession]=useState(authUser.info.profession?authUser.info.profession:'')
    const [location,setLocation]=useState(authUser.info.location?authUser.info.location:'')
    const date2 = new Date(authUser.info.birthDay);
    function formatDateToInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const formattedDate3 = formatDateToInput(date2);

    const [birthDay,setBirthDay] = useState(authUser.info.birthDay?formattedDate3:'')
    const [bio,setBio] = useState(authUser.info.bio?authUser.info.bio:'')
    const handleProfileImageChange = (ev) => {
        const selectedFile = ev.target.files[0]

        if (selectedFile){
            setProfileImage(selectedFile)
            setBlobProfile(URL.createObjectURL(selectedFile))
        }
    }
    const handleBackgroundImageChange = (ev) => {
        const selectedFile = ev.target.files[0]

        if (selectedFile){
            setBackgroundImage(selectedFile)
            setBlobBackground(URL.createObjectURL(selectedFile))
        }
    }
    const {updateInfo,loading3} = useUpdateInfo()

    const {changePassword,loading4} = useChangePassword()
    const handlePasswordSubmit = async (ev) => {
        ev.preventDefault();
        const success =  await changePassword(currentPassword, newPassword, confirmNewPassword);
        if (success){
            setOpen(false);
            setNewPassword('')
            setConfirmNewPassword('')
            setCurrentPassword('')
        }else{
            setOpen(true)
        }
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        const formData = new FormData()

        if (profileImage){
            formData.append('profileImage',profileImage)
        }
        if (backgroundImage){
            formData.append('backgroundImage',backgroundImage)
        }

        if (fullName !== ''){
            formData.append('fullName',fullName)

        }else{
            formData.append('fullName','')
        }

        formData.append('profession',profession)
        formData.append('location',location)
        formData.append('birthDay',birthDay)
        formData.append('bio',bio)
        formData.append('email',email)
        formData.append('username',username)
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        await updateInfo(formData)
    setVisible(false)
    }

    let formattedDate

    if (authUser.info.birthDay){
        const date = new Date(authUser.info.birthDay);
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
         formattedDate = date.toLocaleDateString('en-US', options);

    }


    return (
        <div className={' w-full h-fit max-h-fit bg-[#FAFAFA] xl:rounded-3xl lg:rounded-2xl md:rounded-xl sm:rounded-lg rounded-md xl:mt-4 lg:mt-3 md:mt-2 sm:mt-1 mt-1 xl:px-4 lg:px-3 md:px-3 sm:px-2 px-1 xl:pt-5 lg:pt-4 md:pt-3 sm:pt-2 pt-1 pb-1'}>
            <section className={'w-full h-fit flex items-center justify-between xl:mb-5 lg:mb-4 md:mb-3 sm:mb-2 mb-2'}>
                <h2 className={'text-black xl:text-lg lg:text-md md:text-sm sm:text-sm text-[10px] font-bold'}>Profile Info</h2>
                <HiOutlinePencilSquare onClick={() => setVisible(true)}
                                       className={'text-black xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px] cursor-pointer'}/>
            </section>
            <div className={'flex items-center justify-start xl:mb-2 lg:mb-2 md:mb-1 sm:mb-1 mb-[2px]'}>
                <h3 className={'text-black xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] font-bold'}>Full Name :</h3>
                <h4 className={'text-black xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] ml-1'}>{authUser.fullName}</h4>
            </div>
            <div className={'flex items-center justify-start xl:mb-2 lg:mb-2 md:mb-1 sm:mb-1 mb-[2px]'}>
                <h3 className={'text-black xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] font-bold'}>Location :</h3>
                <h4 className={'text-black xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] ml-1'}>{authUser.info.location}</h4>
            </div>
            <div className={'flex items-center justify-start xl:mb-2 lg:mb-2 md:mb-1 sm:mb-1 mb-[2px]'}>
                <h3 className={'text-black xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] font-bold'}>Birthday :</h3>
                <h4 className={'text-black xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] ml-1'}>{formattedDate}</h4>
            </div>
            <div className={'flex items-center justify-start xl:mb-2 lg:mb-2 md:mb-1 sm:mb-1 mb-[2px]'}>
                <h3 className={'text-black xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] font-bold'}>Email :</h3>
                <h4 className={'text-black xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] ml-1'}>{authUser.email}</h4>
            </div>
            <div className={'flex items-center justify-start xl:mb-2 lg:mb-2 md:mb-1 sm:mb-1 mb-[2px] overflow-hidden'}>

                <p className={'text-black xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px]'}>
                    <span className={'text-black xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] font-bold mr-2'}>Biography :</span>{authUser.info.bio}</p>
            </div>
            <div className={'w-full h-fit flex items-center cursor-pointer justify-start xl:mt-5 lg:mt-4 md:mt-3 sm:mt-2 mt-2 '} onClick={()=>setOpen(true)}>
                <FaKey className={'text-customGreen  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px]'}/>
            <h2 className={'text-customGreen  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] ml-2'}>Change Password</h2>
            </div>
            <div className={'w-full h-fit flex items-center justify-start xl:mt-5 lg:mt-4 md:mt-3 sm:mt-2 mt-2 '}>
                {loading ?
                    <span className={'loading loading-spinner text-primary'}></span> :
                    <TbLogout2 onClick={handleLogout} className={'xl:text-3xl lg:text-2xl md:text-xl sm:text-lg text-md text-customGreen cursor-pointer mb-3'}/>
                }
            </div>
            {visible ?
                <div
                    className={'w-screen overflow-auto h-screen fixed flex items-center  justify-center bg-white/20 backdrop-blur-sm top-0 left-0 z-50'}>
                    <section
                        className={'xl:w-[55%] lg:w-[55%] md:w-[75%] sm:w-[80%] w-[85%]  rounded-md max-h-[98%] h-fit pb-5 px-6 py-2 pt-7 bg-white shadow-xl relative flex flex-col items-center justify-start'}>
                        <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer  xl:text-lg lg:text-md md:text-md sm:text-sm text-sm'}
                                 onClick={() => {
                                     setVisible(false)
                                     setBlobProfile(null)
                                     setBlobBackground(null)
                                     setBackgroundImage('')
                                     setProfileImage('')
                                     setProfession(authUser.profession?authUser.profession:'')
                                     setUsername(authUser.username ? authUser.username : '')
                                     setEmail(authUser.email ? authUser.email : '')
                                     setFullName(authUser.fullName ? authUser.fullName : '')
                                     setLocation(authUser.info.location ? authUser.info.location : '')
                                     setBirthDay(authUser.info.birthDay ? authUser.info.birthDay : '')
                                     setBio(authUser.info.bio ? authUser.info.bio : '')
                                     setBirthDay(authUser.info.birthDay ? formattedDate3 : '')
                                 }}/>

                        <h1 className={'xl:text-2xl lg:text-xl md:text-lg sm:text-md text-sm text-black font-customOne xl:mb-10 lg:mb-8 md:mb-6 sm:mb-4 mb-3 '}>Your Info</h1>
                        <form className={'w-full h-fit'} onSubmit={handleSubmit}>
                            <div className={'w-full h-fit flex items-center justify-between xl:mb-3 lg:mb-3 md:mb-2 sm:mb-2 mb-1'}>
                                <input
                                    type={'text'}
                                    placeholder={'Full Name'}
                                    value={fullName}
                                    onChange={(ev) => setFullName(ev.target.value)}
                                    className={'input bg-customGray w-1/2  xl:mr-2 lg:mr-2 md:mr-1 sm:mr-1 mr-[2px] xl:h-[47px] lg:h-[44px] md:h-[40px] sm:h-[35px] h-[30px]  focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}
                                />
                                <input
                                    type={'email'}
                                    placeholder={'Email'}
                                    value={email}
                                    onChange={(ev) => setEmail(ev.target.value)}
                                    className={'input bg-customGray w-1/2  xl:ml-2 lg:ml-2 md:ml-1 sm:ml-1 ml-[2px] xl:h-[47px] lg:h-[44px] md:h-[40px] sm:h-[35px] h-[30px]  focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}
                                />
                            </div>

                            <div className={'w-full h-fit flex items-center justify-between xl:mb-3 lg:mb-3 md:mb-2 sm:mb-2 mb-1'}>
                                <input
                                    type={'text'}
                                    value={username}
                                    onChange={(ev) => setUsername(ev.target.value)}
                                    placeholder={'Username'}
                                    className={'input bg-customGray w-1/2 xl:mr-2 lg:mr-2 md:mr-1 sm:mr-1 mr-[2px]  xl:h-[47px] lg:h-[44px] md:h-[40px] sm:h-[35px] h-[30px]  focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}
                                />
                                <input
                                    type={'text'}
                                    value={profession}
                                    onChange={(ev) => setProfession(ev.target.value)}
                                    placeholder={'Profession'}
                                    className={'input bg-customGray w-1/2 xl:ml-2 lg:ml-2 md:ml-1 sm:ml-1 ml-[2px] xl:h-[47px] lg:h-[44px] md:h-[40px] sm:h-[35px] h-[30px]  focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}
                                />
                            </div>
                            <div className={'w-full h-fit flex items-center justify-between xl:mb-3 lg:mb-3 md:mb-2 sm:mb-2 mb-1'}>
                                <input
                                    type={'text'}
                                    value={location}
                                    onChange={(ev) => setLocation(ev.target.value)}
                                    placeholder={'Location'}
                                    className={'input bg-customGray w-1/2 xl:mr-2 lg:mr-2 md:mr-1 sm:mr-1 mr-[2px]  xl:h-[47px] lg:h-[44px] md:h-[40px] sm:h-[35px] h-[30px] focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}
                                />
                                <input
                                    type={'date'}
                                    value={birthDay}
                                    onChange={(ev) => setBirthDay(ev.target.value)}
                                    placeholder={'Birthday'}
                                    className={'input bg-customGray w-1/2 xl:ml-2 lg:ml-2 md:ml-1 sm:ml-1 ml-[2px] xl:h-[47px] lg:h-[44px] md:h-[40px] sm:h-[35px] h-[30px]  focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}
                                />
                            </div>
                            <textarea
                                typeof={'submit'}
                                value={bio}
                                onChange={(ev) => setBio(ev.target.value)}
                                placeholder={'Biography'}
                                className={' input bg-customGray w-full  pt-2  xl:h-20 lg:h-16 md:h-14 sm:h-12 focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}></textarea>
                            <div className={'w-full mt-5 h-fit flex flex-col items-center justify-start'}>
                                <div className={'w-full  h-fit flex items-start justify-around'}>
                                    <section className={'flex flex-col items-center justify-start'}>
                                        <label htmlFor={'input1'}
                                               className={'mr-2 flex items-center justify-center xl:h-12 lg:h-10 md:h-8 sm:h-6 h-5 bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-white xl:w-48 lg:w-44 md:w-40 sm:w-36 w-20  rounded-lg xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px]'}>
                                            Profile Image
                                        </label>
                                        {blobProfile ? (
                                            <div className={'w-full mt-4  h-fit flex items-center justify-center'}>
                                                <section className={'w-fit h-fit relative'}>
                                                    <img className={'xl:w-20 xl:h-20 lg:w-16 lg:h-16 md:w-14 w-20 h-20 md:h-14 sm:w-12 sm:h-12  rounded-md'} src={blobProfile}/>
                                                    <IoClose
                                                        className={'absolute top-1 right-1 text-red-500 cursor-pointer xl:text-lg lg:text-md md:text-md sm:text-sm text-sm'}
                                                        onClick={() => {
                                                            setBlobProfile(null)
                                                            setProfileImage('')
                                                        }}/>
                                                </section>
                                            </div>
                                        ) : null}
                                    </section>
                                    <input
                                        onChange={handleProfileImageChange}
                                        type={'file'}
                                        style={{display: 'none'}}
                                        id={'input1'}
                                    />

                                    <section className={'flex flex-col items-center justify-start'}>
                                        <label htmlFor={'input2'}
                                               className={'ml-2 flex items-center justify-center xl:h-12 lg:h-10 md:h-8 sm:h-6 h-5 bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-white xl:w-48 lg:w-44 md:w-40 sm:w-36 w-20 rounded-lg xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px] '}>
                                            Background Image
                                        </label>

                                        {blobBackground ? (
                                            <div className={'w-full mt-4  h-fit flex items-center justify-center'}>
                                                <section className={'w-fit h-fit relative'}>
                                                    <img className={'xl:w-40 xl:h-20 lg:w-36 w-32 h-20 lg:h-16 md:w-36 md:h-14 sm:w-32 sm:h-12 rounded-md'} src={blobBackground}/>
                                                    <IoClose
                                                        className={'absolute top-1 right-1 text-red-500 cursor-pointer xl:text-lg lg:text-md md:text-md sm:text-sm text-sm'}
                                                        onClick={() => {
                                                            setBlobBackground(null)
                                                            setBackgroundImage('')
                                                        }}/>
                                                </section>
                                            </div>
                                        ) : null}
                                    </section>

                                    <input
                                        onChange={handleBackgroundImageChange}
                                        id={'input2'}
                                        type={'file'}
                                        style={{display: 'none'}}
                                    />
                                </div>
                            </div>
                            <div className={'w-full h-fit flex items-center justify-end mt-6'}>
                                <button type={'submit'}
                                        className={'mr-2 flex items-center justify-center bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-sm xl:h-10 lg:h-9 md:h-8 sm:h-7 h-7  text-white xl:w-22 lg:w-20 md:w-16 sm:w-16 w-16 rounded-lg xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px]'}>
                                    {loading3 ? <span className={'loading loading-spinner'}></span> : 'Update'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div> : null}
            {open ?
                <div
                    className={'w-screen overflow-auto h-screen fixed flex items-center  justify-center bg-white/20 backdrop-blur-sm top-0 left-0 z-50'}>
                    <section
                        className={'xl:w-[55%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[85%] rounded-md max-h-[98%] h-fit pb-5 px-6 py-2 pt-7 bg-white shadow-xl relative flex flex-col items-center justify-start'}>
                        <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer xl:text-lg lg:text-md md:text-md sm:text-sm text-sm'}
                                 onClick={() => {
                                     setOpen(false)
                                     setNewPassword('')
                                     setConfirmNewPassword('')
                                     setCurrentPassword('')
                                 }}/>

                        <h1 className={'xl:text-2xl lg:text-xl md:text-lg sm:text-md text-sm  text-black font-customOne xl:mb-10 lg:mb-8 md:mb-6 sm:mb-5 mb-4 '}>Changing Password</h1>
                        <form className={'w-full h-fit'} onSubmit={handlePasswordSubmit}>
                            <input
                                value={currentPassword}
                                onChange={(ev)=>setCurrentPassword(ev.target.value)}
                                type={'text'}
                                placeholder={'Current Password'}
                                className={'input bg-customGray w-full xl:h-[47px] lg:h-[44px] md:h-[40px] sm:h-[35px] h-[30px] xl:mb-3 lg:mb-3 md:mb-2 sm:mb-2 mb-2  focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}
                            />
                            <input
                                value={newPassword}
                                onChange={(ev)=>setNewPassword(ev.target.value)}
                                type={'text'}
                                placeholder={'New Password'}
                                className={'input bg-customGray w-full xl:h-[47px] lg:h-[44px] md:h-[40px] sm:h-[35px] h-[30px] xl:mb-3 lg:mb-3 md:mb-2 sm:mb-2 mb-2  focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}
                            />
                            <input
                                value={confirmNewPassword}
                                onChange={(ev)=>setConfirmNewPassword(ev.target.value)}
                                type={'text'}
                                placeholder={'Confirm New Password'}
                                className={'input bg-customGray w-full xl:h-[47px] lg:h-[44px] md:h-[40px] sm:h-[35px] h-[30px]  focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}
                            />
                            <div className={'w-full h-fit flex items-center justify-end mt-6'}>
                                <button type={'submit'}
                                        className={'mr-2 flex items-center justify-center bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-sm xl:h-10 lg:h-9 md:h-8 sm:h-7 h-7  text-white xl:w-22 lg:w-20 md:w-16 sm:w-16 w-16 rounded-lg xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px]'}>
                                    {loading4?<span className={'loading loading-spinner'}></span>:'Change'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div> : null}

        </div>
    );
}

export default ProfileInfo;