/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

export default interface LicenseInformation {
    /**
     * holder
     */
    h: string,
    /**
     * email
     */
    e: string,
    /**
     * Level
     */
    l: string,
    /**
     * Type
     */
    t: string,
    /**
     * Max instances
     * The maximal amount of instances which are allowed.
     * -1 = unlimited amount.
     * number > 0 = specific max amount.
     */
    mi: number,
    /**
     * version
     */
    v: number,
    /**
     * id
     */
    i: string,
    /**
     * created timestamp
     */
    c: number
}