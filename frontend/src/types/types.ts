export interface Event {
  _id: string;
  name: string;
  date: string;
  location: string;
  price: number;
  seats: number;
  bookedSeats: string[];
  lat: number;
  lng: number;
  // Fields used by EventForm (marked optional to prevent errors if missing)
  destinationName?: string;
  destLat?: number;
  destLng?: number;

  description?: string;
}