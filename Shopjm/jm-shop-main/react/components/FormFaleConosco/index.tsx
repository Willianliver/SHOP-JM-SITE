import React, { useState } from 'react'
import { canUseDOM } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import { Alert } from 'vtex.styleguide'
import axios from 'axios'
import styles from './style.css'

interface ClientData {
    name: string
    email: string
    subject: string
    message: string
}

const ContactCustom = () => {
    const [formData, setFormData] = useState<ClientData>({
        name: '',
        email: '',
        subject: '',
        message: '',
    })

    const [status, setStattus] = useState(null);
    const [loading, setLoading] = useState(false);

    const resetStatus = () => {
        setStattus(null)
    }

    const onChangeForm = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
        setStattus(null)
    }

    const handleSubmit = async (e: any) => {
        setLoading(true)
        e.preventDefault()

        const clData = {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
        }

        await axios
            .post(`/api/dataentities/FC/documents`, {
                ...clData
            })
            .then((response: any) => {
                setStattus(response.status)
                setFormData({ ...formData, ["name"]: '', ["email"]: '', ["subject"]: '', ["message"]: '' })
            }).catch((error: any) => {
                console.log("🚀 ~ file: index.tsx:52 ~ .then ~ error:", error.response.status)
                setStattus(error.response.status)
            }).finally(() => {
                setLoading(false)
            })
    }


    if (canUseDOM) {
        if (loading) {
            return (
                <div>
                    <Spinner color="currentColor" size={20} />
                </div>
            )
        } else {


            return (
                <div>
                    <div className={styles.contact_container}>
                        {/* <div className={styles.contact_header}>
            <span className={styles.contact_sub_title}>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id, explicabo?
            </span>
          </div> */}


                        <form
                            onSubmit={e => {
                                handleSubmit(e)
                            }}
                            className={styles.contact_form}
                        >

                            <label className={`fl w-100 ${styles.contact_label}`}>
                                Seu nome
                                <input
                                    required
                                    className={`${styles.contact_field} ${styles.contact_label_mobile}`}
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={onChangeForm}
                                />
                            </label>
                            <label className={`fl w-100 ${styles.contact_label}`}>
                                Seu e-mail
                                <input
                                    required
                                    className={styles.contact_field}
                                    name="email"
                                    type="text"
                                    value={formData.email}
                                    onChange={onChangeForm}
                                />
                            </label>
                            <label className={`fl w-100 ${styles.contact_label}`}>
                                Assunto
                                <input
                                    required
                                    className={styles.contact_field}
                                    name="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={onChangeForm}
                                />
                            </label>

                            <label className={`fl w-100 ${styles.contact_label}`}>
                                Mensagem
                                <textarea
                                    required
                                    className={`${styles.contact_field} ${styles.contact_area}`}
                                    name="message"
                                    value={formData.message}
                                    onChange={onChangeForm}
                                ></textarea>
                            </label>

                            <div className={styles.alert}>
                                {
                                    status && status != 201 &&
                                    <Alert type="error" onClose={() => resetStatus()}>
                                        Algo deu errado ao enviar. Por favor, Tente contato diretamente através do email:  <a href="mailto:sac@shopjm.com.br.br">sac@shopjm.com.br</a>
                                    </Alert>
                                }

                                {
                                    status == 201 &&
                                    <Alert type="success" onClose={() => resetStatus()}>
                                        Enviado com sucesso!
                                    </Alert>
                                }
                            </div>


                            <div
                                className={`flex ${styles.contact_form__controls} ${styles.contact_btn_rigth}`}
                            >
                                <button className={styles.contact_btn} type="submit">
                                    ENVIAR
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            <Spinner color="currentColor" size={20} />
        </div>
    )
}

export default ContactCustom
