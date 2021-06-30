import { useState } from 'react'
import Router from 'next/router'
import PageShell from '@/components/PageShell'
import { Input, Textarea, Text, Box, Heading, useColorModeValue, Button, useToast } from '@chakra-ui/react'
import { highlight_color } from '@/styles/colorModeValue'
import { ToastError } from '@/components/Toast'
// import { Formik, Form, Field, ErrorMessage } from 'formik';

const Contact = () => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    subject: '',
    honeypot: '',
    message: '',
    replyTo: 'masamichi.kagaya@gmail.com',
    accessKey: process.env.NEXT_PUBLIC_STATIC_FORMS_ACCESS_KEY,
  })

  const [{ error }, setError] = useState({ error: { email: '' } })
  const [response, setResponse] = useState({ type: '', message: '', })
  const toast = useToast()

  const validate = (input) => {
    if (input.target.name === 'email') {
      if (input.target.value === '') { return setError({ error: { email: '' } }) }
      if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(input.target.value)) {
        setError({ error: { email: 'Emailアドレスをご入力ください。' } })
      } else {
        setError({ error: { email: '' } })
      }
    }
  }

  const handleChange = e => {
    if (e.target.name === 'subject') setContact({ ...contact, [e.target.name]: `【アーカイブアプリ】${e.target.value}` })
    else { setContact({ ...contact, [e.target.name]: e.target.value }) }
    validate(e)
  }
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch('https://api.staticforms.xyz/submit', {
        method: 'POST',
        body: JSON.stringify(contact),
        headers: { 'Content-Type': 'application/json' },
      })

      const json = await res.json()

      if (json.success) {
        //成功したらsuccessページに飛ぶ
        Router.push('/contact_success')
      } else {
        setResponse({
          type: 'error',
          message: json.message,
        })
      }
    } catch (e) {
      console.log('An error occurred', e)
      setResponse({
        type: 'error',
        message: '送信中にエラーが発生しました。',
      })
      toast({
        status: 'error',
        isClosable: true,
        duration: 9000,
        render: () => (<ToastError text={"送信中にエラーが発生しました。"} />)
      })
    }
  }

  const highlightColor = useColorModeValue(highlight_color.l, highlight_color.d)

  return (
    <PageShell customPT={null} customSpacing={null}>
      <Box w='full' maxW='640px'>
        <Text>{response.message}</Text>
        <Box>
          <Heading as='h2' fontSize='2xl' mb={16}>お問い合わせ</Heading>
          <form
            action="https://api.staticforms.xyz/submit"
            method="post"
            onSubmit={handleSubmit}>
            <Text mt={6} mb={0} >お名前</Text>
            <Input
              mb={3}
              variant="flushed"
              borderColor='gray.500'
              focusBorderColor={highlightColor}
              type="text"
              name="name"
              onChange={handleChange}
              required
            />
            <Text mt={6} mb={0} >メールアドレス</Text>
            <Input
              mb={3}
              variant="flushed"
              borderColor='gray.500'
              focusBorderColor={highlightColor}
              type="email"
              name="email"
              onChange={handleChange}
              required
            />
            {error.email && <Text color={highlightColor} fontSize='sm'>{error.email}</Text>}
            <Text mt={6} mb={0}>件名</Text>
            <Input
              mb={3}
              variant="flushed"
              borderColor='gray.500'
              focusBorderColor={highlightColor}
              type="text"
              name="subject"
              onChange={handleChange}
              required
            />
            {/* <Input type="hidden" name="subject" onChange={handleChange} /> */}
            <Text mt={6} mb={3}>メッセージ</Text>
            <Textarea
              name="message"
              borderColor='gray.500'
              focusBorderColor={highlightColor}
              onChange={handleChange}
              size="xl"
              rows={10}
              px={4}
              py={2}
              lineHeight={1.6}
              mb={10}
              required
            />
            <Button color='white' bg='#69b578' size='sm' type="submit">送信</Button>
          </form>
        </Box>
      </Box>
    </PageShell>
  )
}

export default Contact