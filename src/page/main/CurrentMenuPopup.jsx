import {useEffect, useState} from "react";
import axios from "axios";

const CurrentMenuPopup = (prop) => {
    const [selectInfo, setSelectInfo] = useState({
        selectMenu: null,
        selectedOptions: {
            opt1: null,
            opt2: null,
        },
    });

    const saveCart = async () => {
        try {
            // selectedOptions에서 opt1, opt2를 하나의 배열로 변환
            const selectedOpts = [
                selectInfo.selectedOptions.opt1,
                selectInfo.selectedOptions.opt2,
            ].filter(opt => opt !== null);  // null이 아닌 값만 필터링

            // 메인 메뉴에 optionYn: 'N' 추가
            const mainMenu = {
                ...prop.currentMenuOption, // selectInfo.selectMenu 대신 prop.currentMenuOption 사용
                optionYn: 'N'
            };

            // API 요청 데이터 구조화
            const requestData = {
                selectMenu: mainMenu,
                orderNum: sessionStorage.getItem("orderNum") || null
            };

            // 선택된 옵션이 있는 경우에만 selectedOptions 포함
            if (selectedOpts.length > 0) {
                requestData.selectedOptions = selectedOpts.map(opt => ({
                    ...opt,
                    optionYn: 'Y'
                }));
            }

            const cartResponse = await axios.post("/api/v1/menu/cart", requestData);

            sessionStorage.setItem("orderNum", cartResponse.data.data.orderNum);
            console.log(cartResponse);
            prop.closeModal();
        } catch (e) {
            console.warn(e);
        }
    };

    const toggleOption = (item) => {
        setSelectInfo((prevState) => {
            const isOpt1 = item.seq === 1 || item.seq === 2;
            const isOpt2 = item.seq === 3 || item.seq === 4;

            return {
                ...prevState,
                selectMenu: prop.currentMenuOption,
                selectedOptions: {
                    ...prevState.selectedOptions,
                    opt1: isOpt1
                        ? prevState.selectedOptions.opt1?.seq === item.seq
                            ? null
                            : item
                        : prevState.selectedOptions.opt1,
                    opt2: isOpt2
                        ? prevState.selectedOptions.opt2?.seq === item.seq
                            ? null
                            : item
                        : prevState.selectedOptions.opt2,
                },
            };
        });
    };

    const isOptionSelected = (item) => {
        const isOpt1 = item.seq === 1 || item.seq === 2;
        const isOpt2 = item.seq === 3 || item.seq === 4;

        if (isOpt1) {
            return selectInfo.selectedOptions.opt1?.seq === item.seq;
        }
        if (isOpt2) {
            return selectInfo.selectedOptions.opt2?.seq === item.seq;
        }
        return false;
    };

    useEffect(() => {
        console.log("선택된 정보:", selectInfo);
    }, [selectInfo]);

    return (
        <div className={`overflow-scroll [&::-webkit-scrollbar]:hidden`}>
            <h1 className="flex font-paperlogy-8ExtraBold text-black text-4xl pt-10 justify-center">
                옵션
            </h1>

            <div className="flex justify-center items-center">
                <img
                    src={prop.currentMenuOption.url}
                    alt={prop.currentMenuOption.name}
                    className="w-30 h-40"
                />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-700 text-center">{prop.currentMenuOption.name}</h3>
            </div>

            {/* 옵션 렌더링 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 p-5 px-[3rem]">
                {prop.relatedOptions?.map((item) => (
                    <div
                        key={item.seq}
                        className={`rounded-lg shadow-md overflow-hidden cursor-pointer w-full p-4 text-left 
                            ${isOptionSelected(item) ? "bg-amber-800" : "bg-orange-400"} 
                            hover:shadow-lg`}
                        onClick={() => toggleOption(item)}
                    >
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p className="text-gray-700">{item.price} 원</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4 px-12">
                {/* 장바구니 버튼 */}
                <button
                    className="px-7 py-3 bg-red-900 text-white rounded hover:bg-gray-300"
                    onClick={saveCart}
                >
                    장바구니
                </button>

                {/* 닫기 버튼 */}
                <button
                    className="px-10 py-3 bg-red-900 text-white rounded hover:bg-gray-300"
                    onClick={prop.closeModal}
                >
                    닫기
                </button>
            </div>

        </div>
    );
};

export default CurrentMenuPopup;