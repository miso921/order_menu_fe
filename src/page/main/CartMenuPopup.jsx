import { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const CartMenuPopup = (prop) => {
    const [cartItems, setCartItems] = useState(null);
    const [groupedItems, setGroupedItems] = useState([]);

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

    // optionYn 값을 기준으로 메뉴와 옵션을 그룹화하는 함수
    const groupMenuItems = (items) => {
        const groups = [];
        let currentGroup = null;

        items.forEach(item => {
            // 메인 메뉴인 경우 (optionYn이 'N'인 경우)
            if (item.optionYn === 'N') {
                if (currentGroup) {
                    groups.push(currentGroup);
                }
                currentGroup = {
                    mainMenu: item,
                    options: [],
                    totalPrice: item.price
                };
            }
            // 옵션인 경우 (optionYn이 'Y'인 경우)
            else if (item.optionYn === 'Y' && currentGroup) {
                currentGroup.options.push(item);
                currentGroup.totalPrice += item.price;
            }
        });

        // 마지막 그룹 추가
        if (currentGroup) {
            groups.push(currentGroup);
        }

        setGroupedItems(groups);
    };

    const handleDelete = async (seq) => {
        try {
            await axios.delete(`/api/v1/menu/cart/${seq}`);
            getCartList();
        } catch (e) {
            console.warn(e);
        }
    };

    useEffect(() => {
        getCartList();
    }, []);

    if (!cartItems) return null;

    const totalOrderPrice = groupedItems.reduce((sum, group) => sum + group.totalPrice, 0);

    return (
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
                    <>
                        <tr key={group.mainMenu.cartSeq} className="border-b">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">
                                <div className="flex items-center gap-2">
                                    {group.mainMenu.name}
                                </div>
                            </td>
                            <td className="p-2">
                                {group.options.map(opt => opt.name).join(', ')}
                            </td>
                            <td className="p-2 text-right">
                                {group.mainMenu.price.toLocaleString()}원
                            </td>
                            <td className="p-2">
                                <button
                                    onClick={() => handleDelete(group.mainMenu.cartSeq)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
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
                    </>
                ))}
                <tr className="font-bold">
                    <td className="p-2" colSpan={3}>총 금액</td>
                    <td className="p-2 text-right">{totalOrderPrice.toLocaleString()}원</td>
                    <td></td>
                </tr>
                </tbody>
            </table>

            <div className="flex justify-end gap-2 mt-4">
                <button
                    className="px-4 py-2 bg-red-900 rounded hover:bg-gray-300"
                    onClick={prop.closeModal}
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default CartMenuPopup;