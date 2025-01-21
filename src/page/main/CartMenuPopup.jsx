import {useEffect, useState} from "react";
import {X} from "lucide-react";
import axios from "axios";
import PortOne from "@portone/browser-sdk/v2";
import {Fragment} from 'react';  // 이 줄 추가

const CartMenuPopup = (prop) => {
    const [cartItems, setCartItems] = useState(null);
    const [groupedItems, setGroupedItems] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState({
        status: "IDLE"
    });

    const [showOrderNumber, setShowOrderNumber] = useState(false);  // 주문번호 모달 상태 추가

    // 모달 종료와 세션스토리지 초기화를 위한 함수
    const handleFinalClose = () => {
        prop.closeModal();  // 메인 모달 닫기
        setShowOrderNumber(false);  // 주문번호 모달 닫기
        sessionStorage.removeItem('orderNum');  // 세션스토리지 초기화
    };

    const getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    const getCartList = async () => {
        const orderNum = prop.orderNum;
        try {
            const response = await axios.get("/api/v1/menu/cart-list", {
                params: {
                    orderNum: orderNum
                }
            });

            if (response.data?.data?.[0]?.selectMenu) {
                setCartItems(response.data.data[0]);
                groupMenuItems(response.data.data[0].selectMenu);
            }
        } catch (e) {
            console.log("장바구니 조회 오류", e);
        }
    };

    const groupMenuItems = (items) => {
        const groups = [];
        let currentGroup = null;

        items.forEach(item => {
            if (item.optionYn === 'N') {
                if (currentGroup) {
                    groups.push(currentGroup);
                }
                currentGroup = {
                    mainMenu: item,
                    options: [],
                    totalPrice: item.price
                };
            } else if (item.optionYn === 'Y' && currentGroup) {
                currentGroup.options.push(item);
                currentGroup.totalPrice += item.price;
            }
        });

        if (currentGroup) {
            groups.push(currentGroup);
        }

        setGroupedItems(groups);
    };

    const handleDelete = async (mainSeq, option) => {
        const optionSeq = option.map(opt => opt.cartSeq);
        const seqParam = [mainSeq, ...optionSeq];
        console.log(seqParam)
        try {
            await axios.put(`/api/v1/menu/cart-list`, seqParam);
            getCartList();
        } catch (e) {
            console.warn(e);
        }
    };

    const handlePayment = async () => {
        setPaymentStatus({status: "PENDING"});
        const totalAmount = Math.floor(cartItems.totalCost)
        const paymentId = [...crypto.getRandomValues(new Uint32Array(2))]
            .map((word) => word.toString(16).padStart(8, "0"))
            .join("");

        try {
            const payment = await PortOne.requestPayment({
                paymentId,
                storeId: "store-cbc58933-71b5-4213-9c48-cfa96f31b4bd",
                channelKey: "channel-key-7d37e557-3127-4e50-a005-1daf20e26125",
                orderName: groupedItems[0]?.mainMenu?.name || "주문",
                totalAmount,
                currency: "CURRENCY_KRW",
                payMethod: 'EASY_PAY',
                easyPay: {
                    provider: 'KAKAOPAY'  // V2에서는 EASY_PAY_PROVIDER_ 접두어 제거
                },
                customer: {
                    id: "GUEST",
                    name: "고객",
                },
                bypass: {
                    kakaopay: {
                        custom_message: groupedItems[0]?.mainMenu?.name
                    }
                },
                orderData: {
                    orderNumber: prop.orderNum
                }
            });

            if (!payment) {
                throw new Error("결제 응답이 없습니다.");
            }
            // 결제 상태 확인 및 처리
            console.log("payment.status", payment)

            if (payment.transactionType === "PAYMENT") {
                setPaymentStatus({status: "PAID"});
                setPaymentStatus({
                    status: "SUCCESS",
                    message: "결제가 완료 되었습니다."
                });
                setShowOrderNumber(true);  // 주문번호 모달 표시
                // 3초 후 모든 모달 닫기 및 초기화
                setTimeout(handleFinalClose, 3000);
            } else {
                throw new Error(payment.message || "결제가 완료되지 않았습니다.");
            }
        } catch (error) {
            console.error("결제 오류:", error);
            setPaymentStatus({
                status: "FAILED",
                message: error.message || "결제 중 오류가 발생했습니다."
            });
        }
    };

    const handleClose = () => {
        setPaymentStatus({status: "IDLE"});
        prop.closeModal();
    };

    useEffect(() => {
        getCartList();
    }, []);

    if (!cartItems) return null;

    return (
        <>
            <div id="payment-wrapper">
                <div className="w-full max-w-2xl mx-auto p-4">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-amber-800">
                            <th className="p-2 text-left">번호</th>
                            <th className="p-2 text-left">상품명</th>
                            <th className="p-2 text-left">옵션</th>
                            <th className="p-2 text-right">가격</th>
                            <th className="p-2 w-12"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {groupedItems.map((group, index) => (
                            <Fragment key={group.mainMenu.cartSeq}>
                                <tr key={group.mainMenu.cartSeq} className="border-b">
                                    <td className="p-2 text-black">{index + 1}</td>
                                    <td className="p-2">
                                        <div className="flex items-center gap-2 text-black">
                                            {group.mainMenu.name}
                                        </div>
                                    </td>
                                    <td className="p-2 text-black">
                                        {group.options.map(opt => opt.name).join(', ')}
                                    </td>
                                    <td className="p-2 text-right text-black">
                                        {group.mainMenu.price.toLocaleString()}원
                                    </td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => handleDelete(group.mainMenu.cartSeq, group.options)}
                                            className="p-1 hover:bg-black rounded-full"
                                        >
                                            <X className="w-4 h-4 text-gray-500"/>
                                        </button>
                                    </td>
                                </tr>
                                {group.options.map((opt) => (
                                    <tr key={opt.cartSeq} className="border-b text-sm text-gray-600">
                                        <td className="p-2"></td>
                                        <td className="p-2" colSpan={2}>+ {opt.name}</td>
                                        <td className="p-2 text-right">+{opt.price.toLocaleString()}원</td>
                                        <td className="p-2"></td>
                                    </tr>
                                ))}
                            </Fragment>
                        ))}
                        <tr className="font-bold">
                            <td className="p-2 text-black" colSpan={3}>총 금액</td>
                            <td className="p-2 text-right text-black">{Math.floor(cartItems.totalCost).toLocaleString('ko-KR')}원</td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="flex justify-between gap-2 mt-4">
                        <button
                            className="px-10 py-2 bg-orange-600 text-white rounded hover:bg-neutral-600"
                            onClick={handlePayment}
                            disabled={paymentStatus.status === "PENDING"}
                        >
                            {paymentStatus.status === "PENDING" ? "결제 처리 중..." : "결제"}
                        </button>
                        <button
                            className="px-10 py-2 bg-red-900 text-white rounded hover:bg-gray-300"
                            onClick={prop.closeModal}
                        >
                            닫기
                        </button>
                    </div>
                </div>

                {/* 결제 상태 다이얼로그 */}
                {paymentStatus.status === "FAILED" && (
                    <dialog open className="p-4 rounded shadow-lg">
                        <h1 className="text-xl font-bold mb-2">결제 실패</h1>
                        <p className="mb-4">{paymentStatus.message}</p>
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                            onClick={() => setPaymentStatus({status: "IDLE"})}
                        >
                            닫기
                        </button>
                    </dialog>
                )}

                {paymentStatus.status === "PAID" && (
                    <dialog open className="p-4 rounded shadow-lg">
                        <h1 className="text-xl font-bold mb-2">결제 성공</h1>
                        <p className="mb-4">결제가 성공적으로 완료되었습니다.</p>
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded"
                            onClick={handleClose}
                        >
                            닫기
                        </button>
                    </dialog>
                )}

                {/* 주문번호 모달 추가 */}
                {showOrderNumber && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                            <p className="text-4xl font-bold text-orange-600 mb-4">
                                주문번호 : {getRandomInt(1, 30)}
                            </p>
                            <p className="text-gray-600">
                                잠시 후 자동으로 창이 닫힙니다.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartMenuPopup;