import { TitleForm } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/titleform";
import { IconBadge } from "@/components/icon-bage";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, LayoutDashboard, ListChecks ,File} from "lucide-react";
import { redirect } from "next/navigation";
import { DescriptionForm } from "./_components/descriptionform";
import { ImageForm } from "./_components/image-form";
import { Label } from "@radix-ui/react-label";
import { Category } from "@prisma/client";
import { CategoryForm } from "./_components/categoryform";
import { PriceForm } from "./_components/priceform";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapterform";

const CourseIdPage = async({params}:{
    params:{courseId:string}
}) => {

    const{userId}=auth();
    if(!userId){
        return redirect("/");
    }

    const course=await db.course.findUnique({
        where:{
            id:params.courseId,
            userId,

        },
        include:{
            chapters:{
             orderBy:{
                position:"asc"
             }
            },
            attachments:{
                orderBy:{
                    createdAt:"desc",
                }
            }
        }
    })

    const categories=await db.category.findMany({
        orderBy:{
            name:"asc"
        }
    });

    if(!course){
        return redirect("/");
    }
    const requiredFields=[
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ]
    const totalFields=requiredFields.length;
    const completedFields=requiredFields.filter(Boolean).length;
    const completionText=`(${completedFields}/${totalFields})`
    return ( 
        <div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium"> Course setup</h1>
                    <span 
                    className="text-sm text-slate-700">  Complete all fields {completionText}</span>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">Customize your course</h2>

                    </div>

                    <TitleForm 
                    initialData={course}
                    courseId={course.id}/>
                    <DescriptionForm
                    initialData={course}
                    courseId={course.id}/>
                   <ImageForm
                   initialData={course}
                   courseId={course.id}/>
                   <CategoryForm
                   initialData={course}
                   courseId={course.id}
                   options={categories.map((category)=>({
                    label:category.name,
                    value:category.id,
                   }

                   ))}/>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListChecks}/>
                        <h2 className="text-xl">
                            Course chapters
                        </h2>
                    </div>
                    <ChaptersForm
                initialData={course}
                courseId={course.id}
              />
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign}/>
                            <h2 className="text-xl"> Sell your course</h2>

                        </div>
                        <PriceForm
                        initialData={course}
                        courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                        <IconBadge icon={ File}/>
                        <h2 className="text-xl">
                           Resource Attachment
                        </h2>
                        </div>
                        <AttachmentForm
                        initialData={course}
                        courseId={course.id}/>
                    </div>

                </div>
            </div>
        </div>
     );
}
 
export default CourseIdPage;