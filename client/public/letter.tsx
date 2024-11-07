export const Letter = ({size = 1361}) => {
    return (
        <svg
            width={size}
            height={size * 882 / 1361}
            viewBox="0 0 1361 882"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <g opacity="0.75" filter="url(#filter0_d_184_755)">
                <rect x="28" y="28" width="1305" height="826" rx="10" fill="#FFF9E8" />
                <rect x="30.5" y="30.5" width="1300" height="821" rx="7.5" stroke="#B3B3B3" strokeWidth="5" />
            </g>
            <path d="M675 455L1327 34" stroke="#A6A18F" strokeWidth="4" strokeLinecap="round" />
            <g filter="url(#filter1_d_184_755)">
                <path d="M33 33L686.273 452.581" stroke="#A6A18F" strokeWidth="4" strokeLinecap="round" />
            </g>
            <defs>
                <filter id="filter0_d_184_755" x="0" y="0" width="1361" height="882" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feMorphology radius="6" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_184_755" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="11" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_184_755" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_184_755" result="shape" />
                </filter>
                <filter id="filter1_d_184_755" x="26.9998" y="30.9998" width="665.274" height="431.582" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_184_755" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_184_755" result="shape" />
                </filter>
            </defs>
        </svg>
    );
}
export default Letter;