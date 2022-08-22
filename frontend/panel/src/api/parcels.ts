import { API_URL, ACCESS_TOKEN_KEY } from "contexts/contants";
import { Result } from "models/auth";
import { Parcel } from "models/parcel";
import { User } from "models/user";

const fetchParcels = async (userId: string): Promise<Result<Parcel[]>> => {
  const response = await fetch(`${API_URL}/fields/refs?userId=${userId}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  }).catch(() => null);
  if (!response || !response.ok) return { isError: true, error: new Error() };
  const parcels = await response.json();
  return { isError: false, data: parcels };
};

const updateParcels = async (user: User, parcels: Parcel[]) => {
  const response = await fetch(`${API_URL}/fields/refs?userId=${user._id}`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY),
    },
    body: JSON.stringify(parcels),
  }).catch(() => null);
  if (!response || !response.ok) return false;
  return true;
};

export const parcelsService = { fetchParcels, updateParcels };
