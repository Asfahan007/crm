import { store } from "@/Store"
import parseTimestampToIST from "./UTCtoIST";

function formatElapsedTime(elapsedTime) {
    if (elapsedTime < 1000) {
        return `${elapsedTime}ms ago`;
      } else if (elapsedTime < 60000) {
        const elapsedSeconds = Math.round(elapsedTime / 1000);
        return `${elapsedSeconds}s ago`;
      } else if (elapsedTime < 3600000) {
        const elapsedMinutes = Math.round(elapsedTime / 60000);
        return `${elapsedMinutes}min ago`;
      } else if (elapsedTime < 86400000) {
        const elapsedHours = Math.round(elapsedTime / 3600000);
        return `${elapsedHours}h ago`;
      } else if (elapsedTime < 604800000) {
        const elapsedDays = Math.round(elapsedTime / 86400000);
        return `${elapsedDays}d ago`;
      } else {
        const elapsedWeeks = Math.round(elapsedTime / 604800000);
        return `${elapsedWeeks}w ago`;
      }
}

export const getNotificationData = async () => {
    try {
        const response = await fetch(
            `https://apps.trisysit.com/posbackendapi/api/getNotifications`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer' + store.getState().auth.token,
                },
            }
        );
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("notification response from global", data.data);
        const filteredData = data.data?.filter(notification => notification.isRead === "false");
        const formattedData = data?.data?.map((notification) => ({
            ...notification,
            time: formatElapsedTime(Date.now() - parseTimestampToIST(notification?.createdDate)),
        }));
        console.log("formattedData", formattedData)
        return { response: formattedData, filteredLength: filteredData.length };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch notification data');
    }
};