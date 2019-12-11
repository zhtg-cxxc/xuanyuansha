'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'xys',
		connect:true,
		character:{
			xy_yaohan:['male','qun',4,['xy_chewang','xy_chewei']],
			xy_baohan:['male','wei',3,['xy_fengxiong']],
		},
		characterTitle:{
			xy_yaohan:'#b信奥看小说',	
			xy_baohan:'#r吉祥物',
		},
		skill:{
			xy_chewang:{
				mod:{
					targetEnabled:function(card,player,target,now){
						if(target.isTurnedOver()){
							if(!(card.name=='sha'||card.name=='tao'||card.name=='jiu'||card.name=='juedou')) return false;
						}
					}
				},
			},
			xy_chewei:{
				audio:'jushou',
				trigger:{player:'phaseJieshuBegin'},
				content:function(){
					'step 0'
					player.draw(3);
					'step 1'
					player.chooseCard('h',true,'请选择一张手牌并弃置之，若你选择了一张装备牌则改为装备之。').set('ai',function(card){
						if(get.type(card)=='equip'){
							return 5-get.value(card);
						}
						return -get.value(card);
					}).set('filterCard',lib.filter.cardDiscardable);
					'step 2'
					if(result.bool&&result.cards.length){
						if(get.type(result.cards[0])=='equip'&&!player.isDisabled(get.subtype(result.cards[0]))){
							player.chooseUseTarget(result.cards[0],true,'nopopup');
						}
						else{
							player.discard(result.cards[0]);
						}
					}
					'step 3'
					player.turnOver();
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(card.name=='guiyoujie') return [0,1];
						}
					}
				},
			},
			xy_fengxiong:{
				
			}
		},
		translate:{
			xy_yaohan:"姚涵",
			xy_baohan:"包涵",
			
			xy_chewang:"车王",
			xy_chewang_info:"锁定技，你处于翻面状态时，除了【杀】、【决斗】、【桃】、【酒】以外，你不能被牌指定为目标。",
			xy_chewei:"车位",
			xy_chewei_info:"结束阶段，你可以获得三张牌并弃置一张手牌，若你选择了一张装备牌，则改为使用之，然后你将你的武将牌翻面。",
		},
	};
});
