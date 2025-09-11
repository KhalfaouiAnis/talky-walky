import Image from "next/image";

type Props = {
    size?: number,
}

function LoadingLogo({ size=50 }: Props) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Image
                src="/logo.svg"
                alt="Logo"
                width={size}
                height={size}
                priority
                className="animate-pulse duration-700"
            />
        </div>
    );
}

export default LoadingLogo;