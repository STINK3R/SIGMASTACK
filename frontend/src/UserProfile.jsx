import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserProfile.module.css';
import defaultPortfolioImage from './img/no-image-available.jpg';
import './ProfileManagement';

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

    // Состояние для изображения плитки
    const [portfolioImage, setPortfolioImage] = useState(defaultPortfolioImage); // Дефолтное изображение

    const handlePortfolioImageChange = (event) => {
    const file = event.target.files[0];
    console.log('Файл выбран:', file); // Для проверки
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('Файл загружен:', e.target.result); // Для проверки
            setPortfolioImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
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

    const handlePortfolioClick = () => {
        navigate('/portfolio');
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
                <div className=''>
                    <div className="input-about">
                        <label>Имя</label>
                        <br></br>
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
                    <input type="email" value={userInfo.email} readOnly className='email' />
                    </div>
                <div className='flex'>
                    <button className='button-change'
                    onClick={handleValueChange}
                    >
                        Изменить информацию
                        </button>
                        </div>
                        </div>
                    <div className={styles.portfolioTile} onClick={handlePortfolioClick}>
                    <h3 className={styles.tileTitle}>Портфолио и резюме</h3>
                    <img 
                        src={portfolioImage} 
                        alt="Портфолио" 
                        className={styles.tileImage} 
                    />

                </div>
            </div>
        </div>
    );
};

export default UserProfile;
