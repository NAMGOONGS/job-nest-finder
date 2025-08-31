import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  X, 
  Upload,
  FileImage
} from 'lucide-react';

interface PostFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

const CommunityWrite: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    category: 'general',
    tags: []
  });

  const handleInputChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).filter(file => {
        // JPG, PNG 파일만 허용
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          alert(`${file.name}은 지원하지 않는 파일 형식입니다. JPG, PNG 파일만 업로드 가능합니다.`);
          return false;
        }
        
        // 파일 크기 제한 (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert(`${file.name}의 파일 크기가 너무 큽니다. 5MB 이하의 파일만 업로드 가능합니다.`);
          return false;
        }
        
        return true;
      });

      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const image of selectedImages) {
      try {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `community/${fileName}`;

        const { error } = await supabase.storage
          .from('images')
          .upload(filePath, image);

        if (error) throw error;

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      } catch (error) {
        console.error('Image upload error:', error);
        alert(`이미지 업로드 중 오류가 발생했습니다: ${image.name}`);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      // 이미지 업로드
      const uploadedImageUrls = await uploadImages();

      // 게시글 생성
      const { error } = await supabase
        .from('community_posts')
        .insert({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          tags: formData.tags,
          user_id: user.id,
          images: uploadedImageUrls
        });

      if (error) throw error;

      alert('게시글이 성공적으로 작성되었습니다.');
      navigate('/community');

    } catch (error) {
      console.error('Error creating post:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      general: '일반',
      qa: '질문&답변',
      success_story: '성공스토리',
      networking: '네트워킹',
      notice: '공지사항'
    };
    return categories[category as keyof typeof categories] || category;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 뒤로가기 버튼 */}
      <Button
        variant="outline"
        onClick={() => navigate('/community')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        커뮤니티로 돌아가기
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">새 게시글 작성</h1>
        <p className="text-gray-600">커뮤니티에 새로운 이야기를 공유해보세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>게시글 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                placeholder="게시글 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">카테고리 *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">일반</SelectItem>
                  <SelectItem value="qa">질문&답변</SelectItem>
                  <SelectItem value="success_story">성공스토리</SelectItem>
                  <SelectItem value="networking">네트워킹</SelectItem>
                  <SelectItem value="notice">공지사항</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>태그</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="태그를 입력하세요"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 내용 */}
        <Card>
          <CardHeader>
            <CardTitle>게시글 내용 *</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="게시글 내용을 입력하세요..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={10}
              required
            />
          </CardContent>
        </Card>

        {/* 이미지 업로드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>이미지 첨부</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="images">이미지 선택</Label>
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  id="images"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  multiple
                  onChange={handleImageSelect}
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('images')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  파일 선택
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                JPG, PNG 파일만 업로드 가능합니다. (최대 5MB)
              </p>
            </div>

            {/* 선택된 이미지 미리보기 */}
            {selectedImages.length > 0 && (
              <div>
                <Label>선택된 이미지 ({selectedImages.length}개)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative border rounded-lg p-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`미리보기 ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="mt-2 text-xs text-gray-600 truncate">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/community')}>
            취소
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? '작성 중...' : '게시글 작성'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommunityWrite;