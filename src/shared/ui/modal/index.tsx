import { useState, useContext, useLayoutEffect } from "react";
import { Product } from "@/entities/CardsGallary/model/types/types";
import { ThemeContext } from "@/app/providers/ThemeProvider";
import styles from "./styles.module.scss";
import ICON from "@/shared/ui/Icons";
import clsx from "clsx";
import { Portal } from "@/shared/ui/portal";


type ModalProps = {
    isVisible: boolean;
    hideModal: () => void;
    setActiveProduct: (product: Product | null) => void;
    product: Product | null;
    products: Product[];
}

export function Modal({ isVisible, hideModal, product, products, setActiveProduct }: ModalProps): JSX.Element | null {
    const [fullScreen, setFullscreen] = useState<boolean>(false);
    const [activeImage, setActiveImage] = useState<string>(product && product.images[0] ? product.images[0] : '');
    const { theme } = useContext(ThemeContext);

    const nextProduct = ((): null | Product => {
        const currentProductIndex = products.findIndex(item => product && item.id === product.id)
        if (currentProductIndex !== -1 && products[currentProductIndex + 1]) {
            return products[currentProductIndex + 1]
        }
        return null;
    })()

    const previousProduct = ((): null | Product => {

        const currentProductIndex = products.findIndex(item => product && item.id === product.id)

        if (currentProductIndex !== -1 && products[currentProductIndex - 1]) {
            return products[currentProductIndex - 1]
        }
        return null;
    })()

    const handleModalHide = (e: React.MouseEvent<HTMLDivElement>): void => {
        const el = e.target as HTMLElement
        if (el.id.toString() === 'modalContainer') hideModal();
    }
    useLayoutEffect(()=> {
        
        if(product) setActiveImage(product.images[0])

    }, [product, activeImage, setActiveImage]);
    
    return (
        isVisible && product ?
            <Portal>
                <div
                    className={styles.modal}
                    data-fullscreen={fullScreen}
                    onClick={handleModalHide}
                    id="modalContainer"
                >
                    <div className={clsx(styles.modalContent, [theme])}>
                        <div className={styles.Header}>
                            <div className={styles.NextPreviButtonsContainer}>
                                <button
                                    disabled={previousProduct ? false : true}
                                    className={clsx(styles.PrevBtn, { "disabled": !previousProduct })}
                                    onClick={() => {
                                        setActiveProduct(previousProduct);
                                        setActiveImage(previousProduct ? previousProduct.images[0] : '')
                                    }
                                    }
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={nextProduct ? false : true}
                                    className={clsx(styles.NextBtn, { "disabled": !nextProduct })}
                                    onClick={() => {
                                        setActiveProduct(nextProduct);
                                        setActiveImage(nextProduct?.images[0] ?? '')
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                            <div className={styles.FullscreenCloseButtons}>
                                <button className={styles.FullScreenBtn} onClick={() => setFullscreen(!fullScreen)}>
                                    <ICON name={fullScreen ? "compress-solid" : "expand-solid"} color="silver" height="16px" />
                                </button>
                                <button className={styles.HeaderCloseBtn} onClick={() => hideModal()}>
                                    <ICON name="xmark-solid" color="white" height="16px" />
                                </button>
                            </div>
                        </div>
                        <div className={styles.Body}>
                            <div className={styles.title}>{product.title}</div>
                            <div className={styles.image}>
                                <div className={styles.activeImage}>
                                    <img src={activeImage} alt="" />
                                </div>
                                <div className={styles.imagesSlider}>
                                    {product.images.map((img, i: number) => (
                                        <img className="image"
                                            key={`${i}_image_${img}`}
                                            onClick={() => setActiveImage(img)}
                                            src={img} alt=""
                                        />
                                    )
                                    )}
                                </div>
                            </div>
                            <div className={styles.price}>
                                <span>Price</span>
                                <span>{product.price}</span>
                            </div>
                            <div className={styles.rating}>
                                <span>Rating</span>
                                <span>{product.rating}</span>
                            </div>
                            <div className={styles.discount}>
                                <span>Discount</span>
                                <span>{product.discountPercentage}%</span>
                            </div>
                            <div className={styles.description}>
                                <span>{product.description}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </Portal> : null
    )
}