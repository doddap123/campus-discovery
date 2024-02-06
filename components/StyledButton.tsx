import {FunctionComponent, ReactNode} from "react";
import styles from "./StyledButton.module.scss";
import Link from "next/link";

export interface StyledButtonProps {
    href?: string,
    children: ReactNode
}

export const StyledButton: FunctionComponent<StyledButtonProps & any> = ({href, children, ...props}) => {
    if (href) {
        return (
            <Link href={href} {...props}>
                <button className={styles.btn}>{children}</button>
            </Link>
        );
    }
    return (<button {...props} className={styles.btn}>{children}</button>);
};
