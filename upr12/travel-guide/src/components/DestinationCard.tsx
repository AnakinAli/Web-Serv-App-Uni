import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import type { Destination } from "@/lib/types";
import SavedButton from "./SavedButton";
export default function DestinationCard({
  destination: item,
}: {
  destination: Destination;
}) {
  return (
    <article className="destination-card">
      <div className="destination-image-wrap">
        <Link
          href={`/destinations/${item.id}`}
          className="image-link"
          aria-label={`Разгледай ${item.name}`}
        >
          <img
            className="destination-image"
            src={item.imageUrl}
            alt={item.name}
          />
        </Link>
        <span className="image-category">{item.type}</span>
        <div className="image-heart">
          <SavedButton id={item.id} compact />
        </div>
      </div>
      <div className="destination-card-body">
        <div className="location-line">
          <MapPin size={14} /> {item.city}, {item.country}
        </div>
        <div className="card-heading">
          <h3>
            <Link href={`/destinations/${item.id}`}>{item.name}</Link>
          </h3>
          <span className="rating">
            <Star size={15} fill="currentColor" />
            {item.rating.toFixed(1)}
          </span>
        </div>
        <p>{item.description}</p>
        <Link className="text-link" href={`/destinations/${item.id}`}>
          Разгледай мястото <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
