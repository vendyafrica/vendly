// components/icons/SocialIcons.tsx
export const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 360 362"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807Z"
    />
  </svg>
);


export const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 666.667 666.667" {...props}>
    <defs>
      <clipPath id="facebook_icon__a" clipPathUnits="userSpaceOnUse">
        <path d="M0 700h700V0H0Z" />
      </clipPath>
    </defs>

    <g
      clipPath="url(#facebook_icon__a)"
      transform="matrix(1.33333 0 0 -1.33333 -133.333 800)"
    >
      <path
        fill="currentColor"
        d="M0 0c0 138.071-111.929 250-250 250S-500 138.071-500 0c0-117.245 80.715-215.622 189.606-242.638v166.242h-51.552V0h51.552v32.919c0 85.092 38.508 124.532 122.048 124.532 15.838 0 43.167-3.105 54.347-6.211V81.986c-5.901.621-16.149.932-28.882.932-40.993 0-56.832-15.528-56.832-55.9V0h81.659l-14.028-76.396h-67.631v-171.773C-95.927-233.218 0-127.818 0 0"
        transform="translate(600 350)"
      />

      <path
        fill="#fff"
        d="m0 0 14.029 76.396H-67.63v27.019c0 40.372 15.838 55.899 56.831 55.899..."
        transform="translate(447.918 273.604)"
      />
    </g>
  </svg>
);


export const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 264.583 264.583"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <radialGradient
        id="instagram_icon__f"
        cx="158.429"
        cy="578.088"
        r="52.352"
        fx="158.429"
        fy="578.088"
        gradientTransform="matrix(0 -4.03418 4.28018 0 -2332.227 942.236)"
        gradientUnits="userSpaceOnUse"
        xlinkHref="#instagram_icon__a"
      />
      {/* repeat same fix for all gradients */}
    </defs>

    <path fill="url(#instagram_icon__e)" d="M204.15 18.143c-55.23..." />
    <path fill="#fff" d="M132.345 33.973c-26.716..." />
  </svg>
);
 