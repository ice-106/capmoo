'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../_components/header";
import Footer from "../../_components/footer";
import ProfilePhoto from "../../_components/profilephoto";
import IconWithLabel from "../../_components/iconwithlabel";
import Carousel from "../../_components/carousel";
import { Star, PencilLine } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [username, setUsername] = useState("username");
    const [userRating, setUserRating] = useState(0);
    const [savedActivites, setSavedActivities] = useState([
        {
            'imgUrl': "/images/default_profile.png",
            'text': "Erm akschoully",
            'onClickUrl': "/",
        }
    ]);
    const [savedReview, setSavedReviews] = useState([
        {
            'imgUrl': "/images/default_profile.png",
            'text': "Erm acktaully",
            'onClickUrl': "/",
        }
    ]);

    return (
        <main className="font-poppins w-full">
            <Header text="Profile" />
            <div
                className="flex flex-col gap-4"
            >
                <div
                    className="flex justify-between"
                >
                    <div
                        className="flex gap-2"
                    >
                        <ProfilePhoto
                            size="sm"
                        />
                        <div
                            className="flex flex-col justify-center gap-1"
                        >
                            <div>
                                {username}
                            </div>
                            <div
                                className="cursor-pointer"
                                onClick={() => router.push("/profile/edit")}
                            >
                                <IconWithLabel
                                    icon={PencilLine}
                                    label="Edit profile"
                                    color="orange"
                                />
                            </div>
                        </div>
                    </div>
                    <IconWithLabel
                        icon={Star}
                        label={userRating.toString()}
                        color="#F6BF27"

                    />
                </div>
                <Carousel
                    header="Saved Activities"
                    images={savedActivites}
                />
                <Carousel
                    header="Saved Reviews"
                    images={savedReview}
                />
            </div>
            <Footer />
        </main>
    )
}