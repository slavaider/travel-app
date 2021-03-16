import Link from "next/Link";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectCube,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
} from "swiper";
import React, { useState } from "react";
import ModalSight from "./ModalSight";
import ModalMap from "./ModalMap";
import ModalSightContent from "./ModalSightContent";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, EffectCube]);

const capitals = [{ 1: "Афины", 2: "Вена", 3: "Будапешт" }];

const capitalInfo = [
  {
    0: "/images/1/capital.jpg",
    1: "/images/1/1.jpg",
    2: "/images/1/2.jpg",
    3: "/images/1/3.jpg",
    4: "/images/1/4.jpg",
    5: "/images/1/5.jpg",
    6: "/images/1/6.jpg",
    7: "/images/1/flag.png",
  },
  {
    1: "Достопримечательность №1",
    2: "Достопримечательность №2",
    3: "Достопримечательность №3",
    4: "Достопримечательность №4",
    5: "Достопримечательность №5",
    6: "Достопримечательность №6",
  },
  {
    1: "/images/1/weather.png",
    2: "/images/1/currency.jpg",
    3: "/images/1/data.jpg",
    4: "/images/1/booking.jpg",
  },
  {
    1: "Прогноз погоды в Афинах",
    2: "Курсы валют",
    3: "Местное время",
    4: "Средняя стоимость гостиниц",
  },
  {
    1: "/images/1/map.png",
  },
  {
    1: "Карта города",
  },
];

const sight_preview = [
  {
    1: "Парфенон - памятник античной архитектуры, древнегреческий храм, расположенный на афинском Акрополе, главный храм в древних Афинах, посвящённый покровительнице этого города и всей Аттики, богине Афине-Девственнице . Построен в 447−438 годах до н. э. архитектором Калликратом по проекту Иктина и украшен в 438−431 годах до н. э. под руководством Фидия при правлении Перикла.",
    2: "Афи́нская агора́ — городская площадь Афин, занимающая территорию приблизительно 40 гектаров и расположенная на пологом склоне к северо-западу от Акрополя. Греческое слово агора́ происходит от ἀγείρω «собирать, созывать». Это соответствует назначению Агоры как главного места встреч в городе.",
    3: "Эрехте́йон (др.-греч. Ἐρέχθειον — храм Эрехтея) — памятник древнегреческой архитектуры, один из главных храмов древних Афин, расположенный на Акрополе к северу от Парфенона. Постройка датируется 421—406 годами до н. э. Выполнен в ионическом ордере. Храм посвящён Афине, Посейдону и легендарному афинскому царю Эрехтею.",
    4: "Новый музей Акрополя — музей в Греции.Был заложен в Афинах 22 декабря 2003 года и официально открыт 20 июня 2009 года.Первый музей Акрополя был сооружен в 1874 году.Множество исследователей сменяли друг друга на протяжении двух веков, и с начала XIX века было обнаружено множество артефактов, количество которых намного превысило предусмотренную ёмкость существующего здания.",
    5: "Церковь Святых Апостолов Солакиса или Агии Апостоли (греч. Ναός Αγίων Αποστόλων Σολάκη) — византийская церковь, возведенная в X веке на юго-восточной окраине современного района древней агоры в Афинах и является одним из древнейших христианских храмов Афин.Церковь Святых Апостолов имеет исключительное значение как единственный памятник Афинской агоры, который сохранился полностью в своем первозданном виде.",
    6: "Метеоры – они хоть и не находятся в Афинах, являются одним из чудес мировой архитектуры. Известны с X века, наряду с Афоном, как один из центров православного монашества в Греции. В 1988 году монастыри, расположенные на вершинах скал, были включены в список объектов Всемирного наследия",
  },
];

const Country = () => {
  const [modal, setModal] = useState({ modalSight: false, modalMap: false });
  return (
    <>
      <div className="capital_wrapper">
        <img className="capital_img" src={capitalInfo[0][0]} />
        <div className="capital_header">
          <h1 className="capital_name">Афины</h1>
          <div className="capital_flag">
            <img className="capital_flag_img" src={capitalInfo[0][7]} />
          </div>
        </div>
        <p className="capital_text">
          Афи́ны (греч. Αθήνα, МФА: [aˈθina]) — столица Греции. Располагается в
          исторической области Аттика и является экономическим, культурным и
          административным центром страны. Город назван в честь богини войны и
          мудрости Афины, которая была покровителем древнего полиса. Афины имеют
          богатую историю; в классический период (V век до н. э.)
          город-государство достигло вершины своего развития, определив многие
          тенденции развития позднейшей европейской культуры. Так, с городом
          связаны имена философов Сократа, Платона и Аристотеля, заложивших
          основы европейской философии, трагиков Эсхила, Софокла и Еврипида,
          стоявших у истоков драмы; политическим строем древних Афин была
          демократия. Площадь территории городской агломерации — 412 км². Эта
          территория окружена горами: Эгалео, Парнис, Пенделикон и Имитос. Общая
          численность населения городской агломерации составляет 1/3 от общей
          численности населения Греции и составляет, в соответствии с переписью
          2011 года, 3 090 508 человек. Таким образом, плотность населения
          городской агломерации — 7500 человек на 1 км². Высота центра города
          над уровнем моря составляет 20 метров, в то время как рельеф
          территории города очень разнообразен, с равнинами и горами.
        </p>

        <div
          onClick={() => {
            setModal({ modalSight: true });
          }}
        >
          <Swiper
            className="swiper-container"
            effect="cube"
            loop={true}
            pagination={{ clickable: true }}
          >
            {[1, 2, 3, 4, 5, 6].map((i, el) => {
              return (
                <SwiperSlide key={i}>
                  <img className="swiper_img" src={capitalInfo[0][i]} />
                  <p className="swiper_img_title">{sight_preview[0][i]}</p>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <Swiper
          className="swiper_2"
          effect="cube"
          loop={true}
          pagination={{ clickable: true }}
        >
          {[1, 2, 3, 4].map((i, el) => {
            return (
              <SwiperSlide key={i}>
                <img className="swiper_img" src={capitalInfo[2][i]} />
                <p className="swiper_img_title">{capitalInfo[3][i]}</p>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div
          className="capital_map"
          onClick={() => {
            setModal({ modalMap: true });
          }}
        >
          <Swiper
            className="swiper_map"
            effect="cube"
            pagination={{ clickable: true }}
          >
            {[1].map((i, el) => {
              return (
                <SwiperSlide key={i}>
                  <img className="swiper_img" src={capitalInfo[4][i]} />
                  <p className="swiper_img_title">{capitalInfo[5][i]}</p>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <ModalSight
          title={capitalInfo[1][1]}
          isOpened={modal.modalSight}
          onModalClose={() => setModal({ modalSight: false })}
        >
          <ModalSightContent sightData={capitalInfo} />
        </ModalSight>
        <ModalMap
          title={capitals[0][1]}
          isOpened={modal.modalMap}
          onModalClose={() => setModal({ modalMap: false })}
        ></ModalMap>
      </div>
    </>
  );
};

export default Country;
