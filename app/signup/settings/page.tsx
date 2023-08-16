"use client"

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getAuth } from "firebase/auth"
import firebaseApp from "@/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import { db, storage } from "@/firebase/config"
import { collection, addDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

const auth = getAuth(firebaseApp)

export default function UserSettings() {
  const router = useRouter()
  const [user] = useAuthState(auth)

  useEffect(() => {
    if (!user) {
      router.push("/signup")
    }
  })

  const [formData, setFormData] = useState({
    name: "",
    profilePicture: null as File | null,
    age: "",
    gender: "",
    dateOfBirth: "",
  })

  const [loading, setLoading] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFormData({
        ...formData,
        profilePicture: event.target.files[0],
      })
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    scrollToTop()
    setLoading(true)

    try {
      if (formData.profilePicture) {
        const storageRef = ref(storage, `profilePictures/${formData.profilePicture.name}`)
        await uploadBytes(storageRef, formData.profilePicture)

        const downloadURL = await getDownloadURL(storageRef)

        const docRef = await addDoc(collection(db, "users"), {
          name: formData.name,
          profilePictureURL: downloadURL,
          age: formData.age,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
        })
        console.log("document written with ID ", docRef.id)
      } else {
        const docRef = await addDoc(collection(db, "users"), {
          data: formData,
        })
        console.log("document without profile picture written with ID ", docRef.id)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const ageOptions = Array.from({ length: 89 }, (_, index) => 12 + index) // Ages from 12 to 100
  const genderOptions = ["Male", "Female"]

  return (
    <form className="mt-60 h-full w-full" action="/api/signup/settings" onSubmit={handleSubmit}>
      <h1 className="text-2xl md:text-4xl my-4 block text-center relative bottom-20">
        Fill in your information
      </h1>
      <div className="grid grid-cols-12 w-full">
        <div className="col-span-5 md:col-span-12">
          <div className="mx-auto text-center flex flex-col md:justify-center md:items-center gap-2">
            <label htmlFor="profilePicture" className="text-lg md:text-xl">
              Profile Picture
            </label>
            <label className="w-1/6">
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                className="inline-block"
                style={{ display: "none" }}
                onChange={handleProfilePictureChange}
              />
              <div className="w-40 h-40 rounded-full border overflow-hidden inline-block">
                {formData.profilePicture ? (
                  <Image
                    src={URL.createObjectURL(formData.profilePicture)}
                    alt="Profile"
                    className="object-cover cursor-pointer"
                    width={300}
                    height={300}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>
            </label>
          </div>
        </div>
        <div className="col-span-7 md:col-span-12">
          <div className="flex flex-col gap-2 md:justify-center md:items-center">
            <label htmlFor="name" className="text-lg md:text-xl text-left">
              Your name
            </label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              className="w-full md:w-1/4 p-2 border-4 rounded text-black border-gray-500"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2 md:justify-center md:items-center">
            <label htmlFor="age" className="text-lg md:text-xl">
              Your age
            </label>
            <select
              name="age"
              className="w-full md:w-1/4 p-2 border-4 rounded text-black border-gray-500"
              value={formData.age}
              onChange={handleInputChange}>
              <option value="">Select Age</option>
              {ageOptions.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-span-12">
          <div className="flex flex-col gap-2 md:justify-center md:items-center">
            <label htmlFor="gender" className="text-lg md:text-xl">
              Your gender
            </label>
            <select
              name="gender"
              className="w-full md:w-1/4 p-2 border-4 rounded text-black border-gray-500"
              value={formData.gender}
              onChange={handleInputChange}>
              <option value="">Select Gender</option>
              {genderOptions.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 md:justify-center md:items-center">
            <label htmlFor="dateOfBirth" className="text-lg md:text-xl">
              Your date of birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              className="w-full md:w-1/4 p-2 border-4 rounded text-black border-gray-500"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-3/5 md:w-1/4 flex justify-center mx-auto border my-10 rounded border-gray-400 bg-gray-600 py-4">
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  )
}
