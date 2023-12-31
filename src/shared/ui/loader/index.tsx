import styles from "./styles.module.scss";

type Props = {
    productsNumber: number;
}

export function Loader({ productsNumber }: Props): JSX.Element {
    const items: number[] = Array.from({ length: productsNumber }, (_: unknown, index: number) => index);

    return (<>
        {
            items.map((item: number) => (
                <span key={item} className={styles.Loader}></span>
            ))}
    </>)
}