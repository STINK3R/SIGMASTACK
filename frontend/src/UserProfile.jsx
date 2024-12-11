import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserProfile.module.css';

const UserProfile = () => {
    const navigate = useNavigate();

    // Состояние для хранения информации о пользователе
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        birthDate: '',
        phoneNumber: '',
        avatar: '' // Для хранения URL аватарки
    });

    const handleLogout = () => {
        // Логика выхода из аккаунта (например, очистка токена)
        navigate('/'); // Перенаправляем на страницу логина
    };
    const handleValueChange = () => {
        navigate('/profilemanagement');
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUserInfo((prevState) => ({
                    ...prevState,
                    avatar: e.target.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <header className={styles.header}>
            </header>
            <h2 className={styles.title}>Личный кабинет</h2>
            <div className={styles.container}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatarCircle}>
                        {userInfo.avatar ? (
                            <img
                                src={userInfo.avatar}
                                alt="Аватар"
                                className={styles.avatarImage}
                            />
                        ) : (
                            <span className={styles.avatarPlaceholder}>+</span>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className={styles.avatarInput}
                        onChange={handleAvatarChange}
                    />
                </div>
                <div className='input-about'>
                    <div className="">
                        <label>Имя</label>
                        <input type="text" value={userInfo.firstName} readOnly />
                    </div>
                    <div className="input-about">
                        <label>Фамилия</label>
                        <input type="text" value={userInfo.lastName} readOnly />
                    </div>
                    <div className="input-about">
                        <label>Отчество</label>
                        <input type="text" value={userInfo.middleNameName} readOnly />
                    </div>
                    <div className="input-about">
                        <label>Дата рождения</label>
                        <input type="date" value={userInfo.birthDate} readOnly />
                    </div>
                    <div className="input-about">
                        <label>Контактная информация</label>
                        <input type="phone" value={userInfo.phoneNumber} readOnly />

                    </div>
                    <input type="email" value={userInfo.email} readOnly />
                    <button className='mt-20' onClick={handleValueChange}>Изменить информацию</button>
                    </div>
            </div>
        </div>
    );
};

export default UserProfile;
