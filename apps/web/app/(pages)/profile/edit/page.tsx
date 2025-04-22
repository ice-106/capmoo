'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from 'react-oidc-context'
import Header from '~/_components/header'
import ProfilePhoto from '~/_components/profile-photo'
import TextBox from '~/_components/text-box'
import Modal from '~/_components/modal'
import { PencilLine } from 'lucide-react'
import Button from '~/_components/button'
import FooterTemplate from '~/_components/footer-template'

const defaultUsername = 'anonymous user'

export default function ProfileEditPage() {
  const auth = useAuth()
  const router = useRouter()
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const username = useRef<HTMLDivElement>(null)
  const newUsername = useRef<HTMLInputElement>(null)
  const name = useRef<HTMLInputElement>(null)
  const tel = useRef<HTMLInputElement>(null)
  const email = useRef<HTMLInputElement>(null)
  const address = useRef<HTMLInputElement>(null)
  const [error, setError] = useState({
    name: false,
    email: false,
  })

  useEffect(() => {
    if (name.current) {
      name.current.value = auth.user?.profile?.name as string
    }
    if (email.current) {
      email.current.value = auth.user?.profile?.email as string
    }
  }, [auth])

  // Function to handle confirming the new username
  const confirmUsernameChange = () => {
    if (!newUsername.current || newUsername.current.value.trim() === '') {
      return
    }

    username.current!.textContent = newUsername.current.value.trim()
    // save to cognito logic here

    setIsOpenEdit(false)
  }

  const cancelUsernameChange = () => {
    setIsOpenEdit(false)
  }

  const handleSave = () => {
    const nameValue = name.current?.value.trim() || ''
    const emailValue = email.current?.value.trim() || ''

    const hasNameError = nameValue === ''
    const hasEmailError = emailValue === ''

    setError({
      name: hasNameError,
      email: hasEmailError,
    })

    if (hasNameError || hasEmailError) {
      return
    }

    // Proceed to save logic if inputs are valid

    console.log('Save success')
  }

  return (
    <main className='font-poppins flex w-full flex-col justify-between pb-12'>
      <Header text='Profile' />

      <Modal isOpen={isOpenEdit} onClose={cancelUsernameChange}>
        <div className='z-50 flex w-64 flex-col gap-2 rounded-md border-2 border-black bg-white p-4'>
          <h2 className='text-orange text-lg font-semibold'>
            Edit your username
          </h2>
          <TextBox
            placeholder='Enter username'
            variant='light'
            errorMessage={
              newUsername.current?.value.trim() === ''
                ? "Username can't be empty"
                : ''
            }
            ref={newUsername}
          />
          <div className='flex items-center justify-between gap-4'>
            <Button label='cancel' onClick={cancelUsernameChange} />
            <Button
              label='confirm'
              onClick={confirmUsernameChange}
              variant='orange'
            />
          </div>
        </div>
      </Modal>

      {/* Main profile edit section */}
      <div className='flex flex-col items-center gap-4'>
        <ProfilePhoto allowEdit={true} />
        <div className='flex gap-2 pl-[26px]'>
          <div ref={username}>
            {(auth.user?.profile?.['cognito:username'] as string) ||
              defaultUsername}
          </div>
          <PencilLine
            color='orange'
            onClick={() => setIsOpenEdit(true)}
            className='cursor-pointer'
          />
        </div>
        <h3 className='w-full'>Contact Information</h3>
        <div className='grid w-full grid-cols-[1fr,3fr] items-center justify-center gap-4'>
          Name
          <TextBox
            placeholder='Enter name'
            variant='light'
            ref={name}
            errorMessage={error.name ? "Name can't be empty" : ''}
          />
          Tel no.
          <TextBox placeholder='0XX-XXX-XXXX' variant='light' ref={tel} />
          Email
          <TextBox
            placeholder='Enter email'
            variant='light'
            ref={email}
            errorMessage={error.email ? "Email can't be empty" : ''}
          />
          Address
          <TextBox placeholder='Enter address' variant='light' ref={address} />
        </div>
      </div>
      <FooterTemplate>
        <div className='flex items-center justify-between gap-4 px-4'>
          <Button
            label='cancel'
            rounded='lg'
            onClick={() => router.push('/profile')}
          />
          <Button
            label='save'
            rounded='lg'
            onClick={handleSave}
            variant='orange'
          />
        </div>
      </FooterTemplate>
    </main>
  )
}
