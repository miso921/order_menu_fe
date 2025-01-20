import {useEffect, useState} from "react";

import {priceCommaHandler} from "../app/common/commonFunction.jsx";

import drinkMenu from "./drinkMenu.js";
import dessertMenu from "./dessertMenu.js";
import Modal from "react-modal";
import CurrentMenuPopup from "./CurrentMenuPopup.jsx";
import menuOption from "./menuOption.js";
import CartMenuPopup from "./CartMenuPopup.jsx";

const Main = () => {
    const [selectedMenu, setSelectedMenu] = useState("drink");

    const [isOpen, setIsOpen] = useState(false);

    const [currentMenuOption, setCurrentMenuOption] = useState({
        seq: 0,
        code: "",
        name: "",
        price: "",
        url: "",
        optSeq: []
    })

    const modalStyle = {
        content: {
            width: "500px", // 팝업 너비
            height: "600px", // 팝업 높이
            margin: "auto", // 중앙 정렬
            padding: "0px", // 내부 여백
            backgroundColor: "#fff", // 배경 흰색
            border: "2px solid #000", // 테두리 설정
            borderRadius: "8px", // 둥근 모서리
            boxShadow: "none", // 그림자 제거
            // overflow: "auto", // 스크롤 활성화
        },
        overlay: {
            backgroundColor: "transparent", // 외부 배경 투명
            display: "flex", // 팝업 중앙 정렬
            alignItems: "center", // 수직 중앙 정렬
            justifyContent: "center", // 수평 중앙 정렬
        },
    };

    const [cartItems, setCartItems] = useState({});

    const [orderNum, setOrderNum] = useState(String);

    const relatedOptions = optionsByMenu(currentMenuOption);

    const Logo = () => (
        <div className="flex justify-center items-center mb-1 pt-3">
            <img className="w-12 h-12 rounded-full border border-r-2 mr-2" src="/logo.png"/>
            <h1 className="text-black text-4xl font-paperlogy-8ExtraBold">성심성의</h1>
        </div>
    );

    const closemodal = () => {
        setIsOpen(false);
    };

    // 현재 선택한 메뉴 토글
    const currentMenu = selectedMenu === "drink" ? drinkMenu : dessertMenu;

    function optionsByMenu() {
        // 필터링하여 관련 옵션만 추출
        const relatedOptions = menuOption.filter((option) =>
            currentMenuOption.optSeq.includes(option.seq)
        );
        return relatedOptions;
    };

    useEffect(() => {
        console.log(cartItems)
    }, [cartItems])

    return (
        <>
            <div className="container">
                {/* 로고 */}
                <Logo/>
                {/*<h1 className="flex font-paperlogy-8ExtraBold text-black text-4xl pt-10 justify-center">*/}
                {/*    성심성의*/}
                {/*</h1>*/}

                {/* 메뉴바 */}
                <div className="flex justify-center pt-3">
                    <button
                        className={`mr-3 px-4 py-2 rounded-lg shadow-xl ${
                            selectedMenu === "drink" ? "bg-amber-800 text-white" : ""
                        } hover:bg-amber-800`}
                        onClick={() => setSelectedMenu("drink")}
                    >
                        음료
                    </button>
                    <button
                        className={`mr-3 px-4 py-2 rounded-lg shadow-xl ${
                            selectedMenu === "dessert" ? "bg-amber-800 text-white" : ""
                        } hover:bg-amber-800`}
                        onClick={() => setSelectedMenu("dessert")}
                    >
                        후식
                    </button>
                </div>

                {/* 콘텐츠 */}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5">
                    {currentMenu &&
                        currentMenu?.map((item) => (
                            <div
                                key={item.seq}
                                className="bg-orange-400 rounded-lg shadow-md hover:shadow-lg overflow-hidden cursor-pointer shadow-xl"
                                onClick={() => {
                                    setIsOpen(!isOpen);
                                    setCurrentMenuOption(item)
                                    optionsByMenu()
                                }}
                            >
                                <img
                                    src={item.url}
                                    alt={item.name}
                                    className="w-full h-20 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-bold">{item.name}</h3>
                                    <p className="text-gray-700">
                                        {priceCommaHandler(item.price)} 원
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="space-y-4 p-5">
                    <button
                        className={`mr-3 px-4 py-2 rounded-lg shadow-xl hover:bg-amber-800`}
                        onClick={() => {
                            setIsOpen(!isOpen);
                            setOrderNum(sessionStorage.getItem("orderNum"))
                            {isOpen && <CartMenuPopup  // 여기가 문제
                                orderNum={orderNum}
                                closeModal={closemodal}
                            />}
                        }}
                    >
                        장바구니
                    </button>
                </div>
            </div>

            <Modal style={modalStyle} isOpen={isOpen} onRequestClose={closemodal} ariaHideApp={false}>
                {isOpen && <CurrentMenuPopup
                    currentMenuOption={currentMenuOption}
                    relatedOptions={relatedOptions}
                    closeModal={closemodal}
                    cart={setCartItems}
                />}
            </Modal>

            <Modal style={modalStyle} isOpen={isOpen} onRequestClose={closemodal} ariaHideApp={false}>
                {isOpen && (orderNum ?
                        <CartMenuPopup
                            orderNum={orderNum}
                            closeModal={closemodal}
                        /> :
                        <CurrentMenuPopup
                            currentMenuOption={currentMenuOption}
                            relatedOptions={relatedOptions}
                            closeModal={closemodal}
                            cart={setCartItems}
                        />
                )}
            </Modal>
        </>
    );
};

export default Main;
