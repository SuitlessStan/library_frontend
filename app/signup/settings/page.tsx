"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import "firebase/compat/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { db, storage, auth } from "@/firebase/config"
import {
  collection,
  addDoc,
  orderBy,
  limit,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc,
  FieldValue,
  doc,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpload, faLeftLong } from "@fortawesome/free-solid-svg-icons"
import { scrollToTop } from "@/utils/helpers"

type UserData = {
  uid: string
  name: string
  age: string
  gender: string
  dateOfBirth: string
  timestamp: FieldValue
  profilePictureURL?: string | null | File // Optional for profile picture URL
}

export default function UserSettings() {
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const [user] = useAuthState(auth)

  const [formData, setFormData] = useState({
    name: "",
    profilePictureURL: null as File | null,
    age: "",
    gender: "",
    dateOfBirth: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchLatestUserSettings = async () => {
      try {
        const usersCollection = collection(db, "users")
        const userQuery = query(
          usersCollection,
          where("uid", "==", user.uid),
          orderBy("timestamp", "desc"),
          limit(1)
        )
        const querySnapshot = await getDocs(userQuery)

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data()
          setFormData((prevFormData) => ({
            name: userDoc.name,
            age: userDoc.age,
            gender: userDoc.gender,
            dateOfBirth: userDoc.dateOfBirth,
            profilePictureURL: userDoc.profilePictureURL || prevFormData.profilePictureURL,
          }))
        }
      } catch (err) {
        console.error("Error fetching user settings:", err)
        setTimeout(() => setError(err as string), 3000)
      }
      setError("")
    }

    fetchLatestUserSettings()
  }, [router, user])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFormData({
        ...formData,
        profilePictureURL: event.target.files[0],
      })
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    scrollToTop()
    setLoading(true)

    try {
      const usersCollection = collection(db, "users")
      const userQuery = query(usersCollection, where("uid", "==", user?.uid))
      const querySnapshot = await getDocs(userQuery)

      // if a document already exists
      if (!querySnapshot.empty) {
        const existingUserDoc = querySnapshot.docs[0]
        const existingUserData = existingUserDoc.data() as UserData
        console.log("existing user data looks like this ", existingUserData)

        let updateData: UserData
        if (existingUserData.profilePictureURL) {
          updateData = {
            uid: user?.uid as string,
            name: formData.name,
            age: formData.age,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            timestamp: serverTimestamp(),
            profilePictureURL: existingUserData.profilePictureURL,
          }
        }
        updateData = {
          uid: user?.uid as string,
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          timestamp: serverTimestamp(),
        }

        if (formData.profilePictureURL && !existingUserData.profilePictureURL) {
          const storageRef = ref(storage, `profilePictures/${formData.profilePictureURL.name}`)
          await uploadBytes(storageRef, formData.profilePictureURL)
          const downloadURL = await getDownloadURL(storageRef)
          updateData.profilePictureURL = downloadURL
        }

        // Check if any fields are different from existing data
        const fieldsChanged = Object.keys(updateData).some(
          (key) => updateData[key as keyof UserData] !== existingUserData[key as keyof UserData]
        )

        if (fieldsChanged) {
          await updateDoc(existingUserDoc.ref, updateData)
        }
      } else {
        // if no documents with those entries have been entered
        const newUserData: UserData = {
          uid: user?.uid as string,
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          profilePictureURL: "",
          timestamp: serverTimestamp(),
        }

        if (formData.profilePictureURL) {
          const storageRef = ref(storage, `profilePictures/${formData.profilePictureURL.name}`)
          await uploadBytes(storageRef, formData.profilePictureURL)
          const downloadURL = await getDownloadURL(storageRef)
          newUserData.profilePictureURL = downloadURL
        }

        await addDoc(usersCollection, newUserData)
      }
    } catch (err) {
      console.error(err)
      setTimeout(() => setError(err as string), 3000)
    }

    setLoading(false)
    setShowAlert(false)
    setError("")
    setTimeout(() => router.push("/"), 3000)
  }

  const ageOptions = Array.from({ length: 89 }, (_, index) => 12 + index) // Ages from 12 to 100
  const genderOptions = ["Male", "Female"]

  return (
    <form
      className="mt-60 h-full w-full relative"
      action="/api/signup/settings"
      onSubmit={handleSubmit}>
      <div className="message-progress">
        {loading && <div className="circular-progress"></div>}
        {showAlert && (
          <div
            className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
            role="alert">
            <div className="flex">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-teal-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Your settings were updated!</p>
                <p className="text-sm">Your new settings are looking good!</p>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert">
            <strong className="font-bold block">Oh no!</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
      <h1 className="text-2xl md:text-4xl my-4 block text-center relative bottom-14">
        Fill in your information
      </h1>
      <div className="mx-auto flex justify-center items-center relative bottom-10 cursor-pointer">
        <FontAwesomeIcon onClick={() => router.back()} icon={faLeftLong} size="2xl" />
      </div>
      <div className="grid grid-cols-12 w-full">
        <div className="col-span-5 md:col-span-12">
          <div className="mx-auto text-center flex flex-col md:justify-center md:items-center gap-2">
            <label htmlFor="profilePicture" className="text-lg md:text-xl text-center p-1">
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
                {formData.profilePictureURL ? (
                  <Image
                    priority
                    src={
                      typeof formData.profilePictureURL == "object"
                        ? URL.createObjectURL(formData.profilePictureURL)
                        : `${formData.profilePictureURL}`
                    }
                    alt="Profile"
                    className="object-cover cursor-pointer"
                    width={300}
                    height={300}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex justify-center items-center cursor-pointer">
                    <FontAwesomeIcon className="fa-2xl" icon={faUpload} />
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
        <div className="col-span-7 md:col-span-12">
          <div className="flex flex-col gap-2 md:justify-center md:items-center">
            <label htmlFor="name" className="text-lg md:text-xl text-left p-1">
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
            <label htmlFor="age" className="text-lg md:text-xl text-left p-1">
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
            <label htmlFor="gender" className="text-lg md:text-xl text-left p-1">
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
            <label htmlFor="dateOfBirth" className="text-lg md:text-xl text-left p-1">
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
        {loading ? "Loading..." : "Submit"}
      </button>
    </form>
  )
}
