export interface Event {
  _id: string;
  name: string;
  date: string;
  location: string;
  lat: number;
  lng: number;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  price: number;
  seats: number;
  bookedSeats: string[];
}
