import {useEffect, useState} from "react";
import axios from "axios";

const CurrentMenuPopup = (prop) => {
    const [selectInfo, setSelectInfo] = useState({
        selectMenu: null,
        selectedOptions: {
            opt1: null, // 1, 2 그룹 선택 상태
            opt2: null, // 3, 4 그룹 선택 상태
        },
    });

    const saveCart = async () => {
        try {
            const cartResponse =  await axios.post("/api/v1/menu/cart", selectInfo);
            prop.cart(cartResponse);
            console.log(cartResponse)
            prop.closeModal();
        } catch (e) {
            console.warn(e);
        }
    }

    const toggleOption = (item) => {
        setSelectInfo((prevState) => {
            // 그룹 판단: 1, 2는 opt1, 3, 4는 opt2
            const isOpt1 = item.seq === 1 || item.seq === 2;
            const isOpt2 = item.seq === 3 || item.seq === 4;

            return {
                ...prevState,
                selectMenu: prop.currentMenuOption,
                selectedOptions: {
                    ...prevState.selectedOptions,
                    opt1: isOpt1
                        ? prevState.selectedOptions.opt1?.seq === item.seq
                            ? null // 동일한 옵션 클릭 시 해제 (toggle)
                            : item // 새로 선택
                        : prevState.selectedOptions.opt1,
                    opt2: isOpt2
                        ? prevState.selectedOptions.opt2?.seq === item.seq
                            ? null // 동일한 옵션 클릭 시 해제 (toggle)
                            : item // 새로 선택
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
                        onClick={() => toggleOption(item)} // 클릭 시 toggleOption 실행
                    >
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p className="text-gray-700">{item.price} 원</p>
                    </div>
                ))}
            </div>

            {/* 장바구니 */}
            <div className={"flex justify-end pr-12"}>
                <button className={"w-24 h-12 bg-red-900"} onClick={saveCart}>담기</button>
            </div>
        </div>
    );
};

export default CurrentMenuPopup;
