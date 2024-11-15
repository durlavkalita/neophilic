import Link from "next/link";

export default function TitleWithBackButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  return (
    <div className="flex items-center justify-start">
      <Link href={url}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          className="cursor-pointer"
        >
          <rect
            x="1"
            y="1"
            width="48"
            height="48"
            stroke="black"
            strokeWidth=".5"
            fill="none"
          />
          <path
            d="M20 25 L30 18 V22 H38 V28 H30 V32 L20 25"
            fill="black"
            transform="translate(-3, 0)"
          />
        </svg>
      </Link>
      <h1 className="ml-2 text-2xl font-semibold">{title}</h1>
    </div>
  );
}
