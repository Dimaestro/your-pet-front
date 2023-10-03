import { useEffect, useState } from 'react';
import styles from './PetCard.module.css';
import sprite from '../../images/icons.svg';
import Button from '../../UI/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeModalPetCardDetails,
  openModalAttention,
  openModalDeleteAdverstiment,
  openModalPetCardDetails,
} from 'redux/global/globalSlice';
import { selectIsModalPetCardDetailsOpen } from 'redux/global/globalSelectors';
import ModalPetCardDetails from 'components/ModalPetCardDetails/ModalPetCardDetails';
import { Modal } from 'components/Modal/Modal';
import { selectIsAuth, selectUser } from 'redux/auth/authSelectors';
import {
  addNoticeToFavoriteThunk,
  deleteNoticeThunk,
  getSelectedNoticeThunk,
  removeNoticeToFavoriteThunk,
} from 'redux/notices/noticeOperations';
import { useLocation } from 'react-router-dom';
import { routerThunk } from 'Utils/constant';

const PetCard = ({ info }) => {
  const { pathname } = useLocation();
  const categoryPath = pathname.split('/').slice(-1).join('');

  const { title, location, category, age, sex, favorites, file, owner, _id } =
    info;

  const dispatch = useDispatch();

  const { user = {} } = useSelector(selectUser) || {};
  const [isFavoriteCard, setisFavoriteCard] = useState(
    favorites.includes(user._id)
  );
  const isUserOwnerAd = owner?._id === user?._id;

  const genderIcon = sex === 'male' ? 'icon-male' : 'icon-female';
  const normalAge =
    age < 1 ? `${Math.ceil(age / (1 / 12))} mont` : `${Math.round(age)} years`;

  const dynamicStyle = {
    backgroundImage: `url(${file})`,
  };

  const handleOpenModal = id => {
    dispatch(getSelectedNoticeThunk({ id }));
    dispatch(openModalPetCardDetails());
    document.body.style.overflow = 'hidden';
  };

  const isAuth = useSelector(selectIsAuth);

  const handleToggleFavoriteAds = () => {
    if (isAuth) {
      if (isFavoriteCard) {
        dispatch(removeNoticeToFavoriteThunk({ _id, thunk: routerThunk[categoryPath] })).then(() => {
          setisFavoriteCard(false);
        });
      } else {
        dispatch(addNoticeToFavoriteThunk( _id)).then(() => {
          setisFavoriteCard(true);
        });
      }
    } else {
      dispatch(openModalAttention());
      document.body.style.overflow = 'hidden';
    }
  };

  const handleOpenModalDeleteAdverstiment = id => {
    dispatch(getSelectedNoticeThunk({ id }));
    dispatch(openModalDeleteAdverstiment());
    document.body.style.overflow = 'hidden';
  };

  return (
    <li className={styles.item}>
      <div className={styles.card} style={dynamicStyle}>
        <div className={styles.topParams}>
          <p className={styles.type}>{category}</p>
          <div>
            <div
              className={
                isFavoriteCard
                  ? `${styles.heartActiveIcon} ${styles.iconWrap}`
                  : `${styles.heartIcon} ${styles.iconWrap}`
              }
              onClick={handleToggleFavoriteAds}
            >
              <svg className={`${styles.heart} ${styles.icon}`}>
                <use href={sprite + '#icon-heart'} />
              </svg>
            </div>
            {isUserOwnerAd && (
              <div
                onClick={handleOpenModalDeleteAdverstiment}
                className={`${styles.trashIcon} ${styles.iconWrap}`}
              >
                <svg className={styles.icon}>
                  <use href={sprite + '#icon-trash-2'} />
                </svg>
              </div>
            )}
          </div>
        </div>
        <div className={styles.bottomParams}>
          <div className={styles.parameter}>
            <svg className={styles.icon}>
              <use href={sprite + '#icon-location-1'} />
            </svg>
            <p>
              {location.length > 5 ? location.slice(0, 5) + '...' : location}
            </p>
          </div>
          <div className={styles.parameter}>
            <svg className={styles.icon}>
              <use href={sprite + '#icon-clock'} />
            </svg>
            <p>{normalAge}</p>
          </div>
          <div className={styles.parameter}>
            <svg className={styles.icon}>
              <use href={sprite + '#' + genderIcon} />
            </svg>
            <p>{sex}</p>
          </div>
        </div>
      </div>
      <p className={styles.info}>{title[0].toUpperCase() + title.slice(1)}</p>
      <div className={styles.btn}>
        <Button text={'Learn more'} onClick={() => handleOpenModal(_id)} />
      </div>
    </li>
  );
};

export default PetCard;
